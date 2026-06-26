"""
- Create an iterator for a list and print elements using next().
"""

class CustomIterator:
    def __iter__(self):
        self.a = 0
        return self
    
    def __next__(self):
        if self.a <= 10:
            x = self.a
            self.a += 1
            return x
        else:
            raise StopIteration

iter1 = CustomIterator()
myIter = iter(iter1)

for i in myIter:
    print(i)

