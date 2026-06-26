"""
- Write a custom iterator class that returns numbers from 1 to N.
"""

class CustomIterator():
    def __init__(self, n):
        self.n = n
    
    def __iter__(self):
        self.a = 1
        return self
    
    def __next__(self):
        if self.a <= self.n:
            x = self.a
            self.a += 1
            return x
        else:
            raise StopIteration

iterr = CustomIterator(10)
myIter = iter(iterr)

for i in myIter:
    print(i)