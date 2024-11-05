Feature: Math Precision

    Especially in Javascript, 
    simple math operands are not always exactly precise 
    concerning floating point values.

    In order to get better precision,
    we need to utilize some simple integer conversions in our library
    so that we can get the exact value we're comparing against.

    In future iterations specific to JavaScript,
    we will utilize BigInt
    to surpass the limitations of 64-bit values in these calculations

    @JavaScript
    Scenario: Adding floats
        Given the following values
            | values      | answer |
            | 0.1, 0.2    | 0.3    |
            | 1, 0.1, 0.3 | 1.4    |
        When I get the sum of the values
        Then the result should match the provided answer

    @JavaScript
    Scenario: Multiplying floats
        Given the following values
            | values   | answer |
            | 0.1, 0.2 | 0.02   |
        When I get the product of the values
        Then the result should match the provided answer
