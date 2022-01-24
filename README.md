# Conway's Soldiers

The game [Conway's Soldiers](https://mathworld.wolfram.com/ConwaysSoldiers.html) on a 10 x 10 checkerboard. There are two URL parameters `starting_checkers` and `animate`.

The squares are numbered 1 - 100 left to right, top to bottom, e.g. top left is 1, top right is 10 and bottom right is 100.

The parameter starting_checkers takes comma separated square numbers and places checkers there. The parameter animate takes pairs of numbers comma separated (both between numbers in the pair and between pairs) and animates the starting checkers moving from - to in the animate pair in order.

The motivation behind this was to be able to supply URL's of the solutions to levels 1 - 4 with the same single page.

The Play/Reset button changes the mode from adding checkers to playing the game. On play the URL beneath the button is updated with the `starting_checkers` parameter currently in use.

## Examples of animated solutions

**Level 1**
https://skamper1.github.io/conways_soldiers/index.html?starting_checkers=55,65&animate=65,45

**Level 2**
https://skamper1.github.io/conways_soldiers/index.html?starting_checkers=55,56,57,65&animate=65,45,57,55,55,35

**Level 3**
https://skamper1.github.io/conways_soldiers/index.html?starting_checkers=54,55,56,57,58,64,65,66&animate=66,46,58,56,56,36,65,45,64,44,44,46,46,26

**Level 4**
https://skamper1.github.io/conways_soldiers/index.html?starting_checkers=53,54,55,56,57,58,59,63,64,65,66,67,73,74,75,76,77,78,85,86&animate=64,44,63,43,43,45,55,35,75,55,73,75,85,65,65,45,66,46,86,66,78,76,76,56,67,47,59,57,56,36,45,25,57,37,37,35,35,15
