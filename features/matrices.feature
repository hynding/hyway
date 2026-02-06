Feature: Matrices

  Scenario: getUniqueValueIndicesFromMatrix
    Given the following trimmed matrix
      | 8 | 9 |   |
      | 8 | 9 | 3 |
      | 4 | 8 | 9 |
    When I request the unique value indices from the matrix
    Then I should get the following indices matrix
      | 1 | 2 |
      | 2 | 0 |

  # Scenario: getExclusiveValueSetIndicesFromMatrix
  #   Given the following trimmed matrix
  #     |   | B |   |   |   |   | G |   |
  #     | A | B |   |   |   |   |   |   |
  #     |   | B | C |   |   |   |   |   |
  #     | A |   |   | D |   |   |   |   |
  #     | A |   | C |   |   |   |   |   |
  #     |   |   |   |   | E | F |   |   |
  #     | A | B | C | D | E | F | G | H |
  #     |   |   |   |   | E | F |   |   |
  #   When I request the exclusive value set indices from the matrix
  #   Then I should get the following indices matrix
  #     | 1 | 2 | 4 |
  #     | 5 | 7 |   |