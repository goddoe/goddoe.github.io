---
layout: post
title:  "Run All TestCase in a Project"
date:   2017-12-21 00:03:55 +0900
categories: Git
---


# Method 1: Make python script to run test case
+ pros: can explicitly indicate modules to test 
```python
testmodules = [
    'cogapp.test_makefiles',
    'cogapp.test_whiteutils',
    'cogapp.test_cogapp',
    ]

suite = unittest.TestSuite()

for t in testmodules:
    try:
        # If the module defines a suite() function, call it to get the suite.
        mod = __import__(t, globals(), locals(), ['suite'])
        suitefn = getattr(mod, 'suite')
        suite.addTest(suitefn())
    except (ImportError, AttributeError):
        # else, just load all the test cases from the module.
        suite.addTest(unittest.defaultTestLoader.loadTestsFromName(t))

unittest.TextTestRunner().run(suite)
```

# Method 2: Using uniitest 
```bash
python -m unittest discover <test_directory>
# or
python -m unittest discover -s <directory> -p '*_test.py'
```
