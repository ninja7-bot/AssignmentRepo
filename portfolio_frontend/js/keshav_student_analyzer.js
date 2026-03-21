/* Data Structure: Creating the students structure to store the student records along with their attendance. */
const students = [
    {
        name: "Lalit",
        marks: [
            { subject: "Math", score: 78 },
            { subject: "English", score: 82 },
            { subject: "Science", score: 74 },
            { subject: "History", score: 69 },
            { subject: "Computer", score: 88 }
        ],
        attendance: 82
    },
    {
        name: "Rahul",
        marks: [
            { subject: "Math", score: 90 },
            { subject: "English", score: 85 },
            { subject: "Science", score: 80 },
            { subject: "History", score: 76 },
            { subject: "Computer", score: 92 }
        ],
        attendance: 91
    },
    {
        name: "Aman",
        marks: [
            { subject: "Math", score: 65 },
            { subject: "English", score: 70 },
            { subject: "Science", score: 68 },
            { subject: "History", score: 72 },
            { subject: "Computer", score: 75 }
        ],
        attendance: 60
    },
    {
        name: "Riya",
        marks: [
            { subject: "Math", score: 88 },
            { subject: "English", score: 90 },
            { subject: "Science", score: 35 },
            { subject: "History", score: 80 },
            { subject: "Computer", score: 85 }
        ],
        attendance: 85
    }
];

/* Adding Required Functionalities */
/* 1. Total Marks for Each Student */
function calcTotalMarks(studentMarksArray) {
    total = 0
    for (i of studentMarksArray) {
        total += i['score']
    }
    return total
}

/* 2. Average Marks. Added a clause to check if the subject count is 0 to avoid division by 0. */
function calcAvgMarks(totalMarks, subCount) {
    if (subCount == 0) {
        return 0
    } else {
        return totalMarks / subCount
    }
}

/* 3.1 [function needed to accurately grade] Fail conditions check for low attendance and score. */
function checkFailConditions(marksArray, attendance) {
    if (attendance < 75) {
        return "Low Attendance";
    }
    for (i = 0; i < marksArray.length; i++) {
        if (marksArray[i].score <= 40) {
            return `Failed in ${marksArray[i].subject}`;
        }
    }
    return false;
}

/* 3. Grades based on scores. */
function assignGrade(average, marksArray, attendance) {
    const failReason = checkFailConditions(marksArray, attendance);
    if (failReason) {
        return `Fail (${failReason})`;
    }
    if (average >= 85) return "A";
    if (average >= 70) return "B";
    if (average >= 50) return "C";
    return "Fail"; // Falls through if average < 50
}

/* 4. Subject Wise Highest scores and scorers. Creating a hashmap to store the highest scores and scorers 
    by generating a list of subjects from the first student record.
    -> Possible problem can be if the subjects do not remain consistent or if two students have same marks. */
function subjectWiseHighest(records) {
    subjectHighest = {};

    subjects = [];
    for (subject of records[0]['marks']) {
        subjects.push(subject['subject']);
    }

    for (s = 0; s < subjects.length; s++) {
        currentSubject = subjects[s];

        highestScore = 0;
        topScorer = "";

        for (i = 0; i < records.length; i++) {
            student = records[i];

            for (j = 0; j < student['marks'].length; j++) {
                mark = student['marks'][j];

                if (mark['subject'] === currentSubject) {
                    if (mark['score'] > highestScore) {
                        highestScore = mark['score'];
                        topScorer = student['name'];
                    }
                }
            }
        }

        subjectHighest[currentSubject] = {
            name: topScorer,
            score: highestScore
        };
    }

    return subjectHighest;
}

console.log(subjectWiseHighest(students))

/* Generate the results by combining the testing block. */
function generateResults(records) {
    results = [];

    for (stu of records) {
        student = stu;
        marksArray = stu['marks']

        total = calcTotalMarks(marksArray);
        avg = calcAvgMarks(total, marksArray.length);
        grade = assignGrade(avg, marksArray, student['attendance']);

        result = {};

        result['name'] = student['name'];
        result['attendance'] = student['attendance'];
        result['total'] = total;
        result['average'] = avg;
        result['grade'] = grade;
        result['marks'] = student['marks'];

        results.push(result);
    }

    return results
}

// Displaying the results generated from the generate function.
function displayResults(results) {
    console.log("----- STUDENT RESULTS -----");

    for (res of results) {
        console.log("|- Name:", res['name']);
        console.log("|- Attendance:", res['attendance']);
        console.log("|- Total:", res['total']);
        console.log("|- Average:", res['average']);
        console.log("|- Grade:", res['grade']);

        console.log("|- Marks:");
        for (mark of res['marks']) {
            console.log("|- \t\t", mark.subject + ": " + mark.score);
        }

        console.log("----------------------");
    }

    return results;
}

// results = generateResults(students)
// displayResults(results)