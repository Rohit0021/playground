#include <stdio.h>
#include <stdlib.h>

#define endl printf("\n")
#define str string

typedef enum boolean {
  false = 0,
  true = 1
} bool;

typedef char* string;

void main (int argc, char** const argv) {
  printf("Hello, world!");
  endl;
  str s = "...";
  printf("%s", s);
}