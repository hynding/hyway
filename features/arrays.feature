Feature: Arrays

    Scenario: adjacent mathends
        Given the following array
            | 0 | 2 | 0 | 2 |
        And the adjacent mathend empty value is 0
        And I wish to operate on the sums of 2 adjacent mathend values
        When I request the adjacent mathends to the right
        Then I should get the following array
            | 0 | 0 | 0 | 4 |
