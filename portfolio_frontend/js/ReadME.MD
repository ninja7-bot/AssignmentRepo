# Student Performance Analyzer

This is a basic JavaScript console program to analyze student performance using arrays, objects, loops, and functions.

## Data Structure

* Students stored as objects
* Each student contains:

  * `name`
  * `marks` (array of subjects and scores)
  * `attendance`

---

## Features

### Total Marks

* Add all subject scores for each student
* Function used: `calcTotalMarks()`

---

### Average Marks

* Average = total marks / number of subjects
* Function used: `calcAvgMarks()`

---

### Grade Calculation

* Based on average marks:

  * 85+ → A
  * 70–84 → B
  * 50–69 → C
  * Below 50 → Fail
* Function used: `assignGrade()`

---

### Fail Conditions

* Attendance < 75 → Fail
* Any subject ≤ 40 → Fail
* Function used: `checkFailConditions()`

---

### Subject-wise Highest

* Find highest score for each subject
* Also stores the student name
* Function used: `subjectWiseHighest()`

---

### Subject-wise Average

* Calculate average score for each subject
* Function used: `subjectWiseAverage()`

---

### Class Topper

* Student with highest total marks
* Function used: `findClassTopper()`

---

### Final Results

* Combines all calculations
* Stores:

  * total
  * average
  * grade
  * marks
* Function used: `generateResults()`

---

### Display Output

* Prints:

  * Student results
  * Subject highest scores
  * Subject averages
  * Class topper
* Function used: `displayResults()`

---


