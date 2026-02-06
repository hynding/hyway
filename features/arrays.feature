Feature: Arrays

    Scenario: adjacent mathends
        Given the following array
            | 0 | 2 | 0 | 2 |
        And the adjacent mathend empty value is 0
        And I wish to operate on the sums of 2 adjacent mathend values
        When I request the adjacent mathends to the right
        Then I should get the following array
            | 0 | 0 | 0 | 4 |

    # Scenario: reducing unique grouped sets A
    #     Given the following set of arrays
    #         | ["B", "G"] | ["A", "B"] | ["B", "C"] | ["A", "D"] | ["A", "B", "C"] | ["E", "F"] | ["A", "B", "C", "D", "E", "F", "G", "H"] | ["E", "F"] |
    #         # |   | B |   |   |   |   | G |   |
    #         # | A | B |   |   |   |   |   |   |
    #         # |   | B | C |   |   |   |   |   |
    #         # | A |   |   | D |   |   |   |   |
    #         # | A | B | C |   |   |   |   |   |
    #         # |   |   |   |   | E | F |   |   |
    #         # | A | B | C | D | E | F | G | H |
    #         # |   |   |   |   | E | F |   |   |
    #     When I request the indices of the unique grouped sets
    #     Then I should get the following set of arrays
    #         | ["G"] | ["A", "B"] | ["B", "C"] | ["D"] | ["A", "B", "C"] | ["E", "F"] | ["H"] | ["E", "F"] |

    # Scenario: reducing unique grouped sets B
    #     Given the following set of arrays
    #         | ["B", "G"] | ["A", "B"] | ["A", "B", "C"] | ["A", "D"] | ["A", "B", "C"] | ["E", "F"] | ["A", "B", "C", "D", "E", "F", "G", "H"] | ["E", "F"] |
    #     When I request the indices of the unique grouped sets
    #     Then I should get the following set of arrays
    #         | ["G"] | ["A", "B"] | ["A", "B", "C"] | ["D"] | ["A", "B", "C"] | ["E", "F"] | ["H"] | ["E", "F"] |

    # Scenario: reducing unique grouped sets C
    #     Given the following set of arrays
    #         | [1,2,3] | [1,2,3] | [9] | [3,4,6,7] | [2,5,7] | [2,3,5,6,7] | [8] | [1,3,7] | [1,3,7] |
    #     When I request the indices of the unique grouped sets
    #     Then I should get the following set of arrays
    #         | [1,2,3] | [1,2,3] | [9] | [3,4,6,7] | [2,5,7] | [2,3,5,6,7] | [8] | [1,3,7] | [1,3,7] |

    # Scenario: reducing unique grouped sets D
    #     Given the following set of arrays
    #         | [2, 3, 8] | [2, 3, 8] | [1] | [3, 6, 9] | [2, 5, 8, 9] | [2, 3, 5, 6, 8] | [7] | [2, 3] | [2, 3, 4] |
    #     When I request the indices of the unique grouped sets
    #     Then I should get the following set of arrays
    #         | [2, 3, 8] | [2, 3, 8] | [1] | [6, 9] | [5, 9] | [5, 6] | [7] | [2, 3] | [4] |
            


