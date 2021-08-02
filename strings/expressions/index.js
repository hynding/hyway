// Digits
export const DIGIT = /^[0-9]+$/
export const ALPHABETIC = /^[a-zA-Z]+$/
export const ALPHANUMERIC = /^[a-zA-Z0-9]+$/

//Date (MM/DD/YYYY)/(MM-DD-YYYY)/(MM.DD.YYYY)/(MM DD YYYY)
export const FRIENDLY_MMDDYYYY = /^(0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2}$/
//Email Address
export const EMAIL = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/
//Password
//The password must contain one lowercase letter, one uppercase letter, one number, one unique character such as !@#$%^&? and be at least 6 characters long.
export const PASSWORD = /^.*(?=.{6,})(?=.*d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/
//US Phone Numbers
export const US_PHONE_NUMBER = /^(?([0-9]{3}))?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
//US Zip code
export const US_ZIP_CODE = /^[0-9]{5}(?:-[0-9]{4})?$/
//Slug
export const SLUG = /^[a-z0-9-]+$/
//URL
export const URL = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
//IP Address
export const IP = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
//HTML Tag
export const HTML = /^<([a-z]+)([^<]+)*(?:>(.*)</1>|s+/>)$/
//All the special characters need to be escaped
export const ESCAPED_SPECIAL_CHARACTERS = /[\-\[\]\/\\\{\}\(\)\*\+\?\.\^\$\|]/