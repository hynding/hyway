import fs from 'fs';
import path from 'path';

const LANGUAGE_MAP = {
  ts: {
    name: 'TypeScript',
    extension: 'ts',
  },
  js: {
    name: 'JavaScript',
    extension: 'js',
  },
}

type GenerateIndexFilesOptionsMode = 
  'replace' | // replace existing index files if it exists
  'append' | // append to existing index files if it exists
  'skip'; // skip creating index files if they already exist

type GenerateIndexFilesOptionsReplaceRule = 
  undefined |
  'timestamp' |
  ((filename: string) => string);

export type GenerateIndexFilesOptions = {
  mode?: GenerateIndexFilesOptionsMode;
  includeFileExtensionInExportPath?: boolean;
  includeChildExports?: boolean; // whether to include exports from child directories
  includeFileExtensions?: string[];
  excludeFolderNames?: string[];
  excludeFileNames?: string[];
  depth?: number;
  replaceRule?: GenerateIndexFilesOptionsReplaceRule;
  exportExtension?: string; // extension to use for the generated index file
}

export const getDefaultGenerateIndexFilesOptions = (): GenerateIndexFilesOptions => ({
  mode: 'append',
  includeFileExtensionInExportPath: false,
  includeChildExports: true,
  includeFileExtensions: [],
  excludeFolderNames: [],
  excludeFileNames: [],
  depth: -1,
});

export const generateIndexFiles = (
  srcPath: string,
  language: keyof typeof LANGUAGE_MAP = "ts",
  _options: GenerateIndexFilesOptions = getDefaultGenerateIndexFilesOptions(),
): boolean => {

  const options = { ...getDefaultGenerateIndexFilesOptions(), ..._options };
  const ext = `.${LANGUAGE_MAP[language].extension}`;
  const {
    includeFileExtensionInExportPath = false,
    exportExtension = ext
  } = options;

  const generateIndexFile = (dir: string) => {
    const files = fs.readdirSync(dir);
    console.log('dir', dir, 'files', files)
    const exports = files
      .filter(file => 
        file !== `index${ext}` && (
          file.endsWith(ext) || 
          options.includeFileExtensions?.includes(path.extname(file)) ||
          fs.lstatSync(path.join(dir, file)).isDirectory() // include directories if child exports are enabled
        )
      )
      .map(file => {
        const fileName = path.basename(file, ext);
        const relativePath = path.relative(dir, path.join(dir, file));
        const importPath = relativePath.replace(ext, includeFileExtensionInExportPath ? exportExtension : '');
        return `export * from './${importPath}';`;
      })
      .join('\n');

    if (exports) {
      fs.writeFileSync(path.join(dir, `index${ext}`), exports);
    }
  };

  const walkDirectory = (currentPath: string) => {
    const subdirs = fs.readdirSync(currentPath).filter(subdir => {
      return fs.statSync(path.join(currentPath, subdir)).isDirectory();
    });

    for (const subdir of subdirs) {
      walkDirectory(path.join(currentPath, subdir));
    }
    generateIndexFile(currentPath);
  };

  walkDirectory(srcPath);
  return true;
}