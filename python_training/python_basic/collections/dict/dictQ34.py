"""
34. Merge two dictionaries.
"""

dictA = {'name': 'Dark', 'age': 25}
dictB = {'city': 'Mumbai', 'state': 'Maharashtra'}

# Merging dictionaries using the update() method
mergedDict = dictA.copy()  # Create a copy of dictA
mergedDict.update(dictB)    # Update the copy with dictB
print(mergedDict)