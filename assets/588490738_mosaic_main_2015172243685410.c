
// header files
#include "mosaic_lib.h"


// main program
int main()
{
    // set seed for random number generation
        // functions: srand, time
    srand(time(NULL));

    // declare and initialize the degraded murals
    int muralOfUnity[SIZE][SIZE] =
    {
        {12, 3, 7, 14, 5, 8},
        {9, 16, 11, 0, 2, 18},
        {21, 4, 13, 22, 6, 19},
        {15, 10, 24, 20, 3, 17},
        {8, 26, 28, 1, 23, 30},
        {31, 0, 34, 33, 29, 25}
    };

    int muralOfVictory[SIZE][SIZE] =
    {
        {1, 2, 3, 4, 5, 6},
        {7, 8, 9, 10, 11, 12},
        {13, 14, 15, 16, 17, 18},
        {19, 20, 21, 22, 23, 24},
        {25, 26, 27, 28, 29, 30},
        {31, 32, 33, 34, 35, 36}
    };

    // print an explanation to the problem
    puts("\nDear Art Conservator, the Mural of Unity and the Mural of Victory");
    puts(" need your help! Please restore the murals, the stories of Azura");
    puts("depend on you!\n");
    puts("=================================================================\n");

    // print the degraded mural of unity
        // functions: printf, printMatrix
    printf("Degraded Mural of Unity:\n");
    printMatrix(muralOfUnity);

    // Task 1: reordering the mosaic tiles to order them properly
        // function: transpose
    transpose(muralOfUnity);
    // print the semi-restored mural
        // functions: printf, printMatrix
    printf("\nMural of Unity after reordering the titles:\n");
    printMatrix(muralOfUnity);

    // Task 2: rotating the tiles to reorder them
        // function: rotate
    rotate(muralOfUnity);
    // print the semi-restored mural
        // functions: printf, printMatrix
    printf("\nMural of Unity after rotating titles:\n");
    printMatrix(muralOfUnity);

    // Task 3: where there is blank titles, clean its row and column
        // function: zeroMatrix
    zeroMatrix(muralOfUnity);
    // print the restored mural
        // functions: printf, printMatrix
    printf("\nMural of Unity after cleaning dirty titles:\n");
    printMatrix(muralOfUnity);

    // print a congratulations message
        // function: puts
    puts("\nCongratulations! You restored the Mural of Unity!");
    puts("\nNow, let's work on the Mural of Victory!");

    // print the degraded murals
        // functions: printf, printMatrix
    printf("Degraded Mural of Victory:\n");
    printMatrix(muralOfVictory);

    // Task 4: rotate a part of the mosaic by k steps
        // function: rotateRow
    rotateRow(muralOfVictory, STEPS);

    // print the restored mural
        // functions: printf, printMatrix
    printf("\nMural after rotating a particular row:\n");
    printMatrix(muralOfVictory);

    // print a congratulations message
        // function: puts
    puts("\nCongratulations! You restored the Mural of Victory!");
    puts("You can now unveil its secret by reading the spiral message!");

    // Task 5: generate the message of the tiles in spiral order
        // function: spiralOrder
    int* spiral = spiralOrder(muralOfVictory);

    // print the message
        // functions: printf
    printf("\nThe secret from the Mural of Victory:\n");
        // traverse the array
    for (int i = 0; i < ARRAY_SIZE; i++)
    {
        // print the message
            // function: printf
        printf("%d ", spiral[i]);
    }
    // cosmetic
    printf("\n");

    // deallocate dynamically allocated memory
    free(spiral);
    return 0;
}
