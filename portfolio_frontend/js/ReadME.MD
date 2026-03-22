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
![Screenshot 1](https://i.postimg.cc/Zv4G8pHY/Screenshot-2026-03-21-185730.png)

* Add all subject scores for each student
* Function used: `calcTotalMarks()`

---

### Average Marks
![Screenshot 2](https://i.postimg.cc/n9py4B2H/Screenshot-2026-03-21-185736.png)

* Average = total marks / number of subjects
* Function used: `calcAvgMarks()`

---

### Grade Calculation
![Screenshot 3](https://i.postimg.cc/YLM56YRM/Screenshot-2026-03-21-185742.png)

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
![Screenshot 4](https://i.postimg.cc/N2B36mDh/Screenshot-2026-03-21-185749.png)

* Find highest score for each subject
* Also stores the student name
* Function used: `subjectWiseHighest()`

---

### Subject-wise Average
![Screenshot 5](https://i.postimg.cc/0KPTYDfF/Screenshot-2026-03-21-185756.png)

* Calculate average score for each subject
* Function used: `subjectWiseAverage()`

---

### Class Topper

* Student with highest total marks
* Function used: `findClassTopper()`

---

### Final Results
[![image.png](https://i.postimg.cc/k4ypRR3w/image.png)](https://postimg.cc/XGp8TJvy)

* Combines all calculations
* Stores:

  * total
  * average
  * grade
  * marks
* Function used: `generateResults()`

---

### Display Output
[![image.png](https://i.postimg.cc/rFDfMPmQ/image.png)](https://postimg.cc/qzdsGQ23)

* Prints:

  * Student results
  * Subject highest scores
  * Subject averages
  * Class topper
* Function used: `displayResults()`

---


