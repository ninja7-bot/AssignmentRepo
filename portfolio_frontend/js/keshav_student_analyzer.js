/* Data Structure: Creating the students structure to store the student records along with their attendance. */
let students = [
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
    let total = 0
    for (let i of studentMarksArray) {
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
    for (let i = 0; i < marksArray.length; i++) {
        if (marksArray[i].score <= 40) {
            return `Failed in ${marksArray[i].subject}`;
        }
    }
    return false;
}

/* 3. Grades based on scores. */
function assignGrade(average, marksArray, attendance) {
    let failReason = checkFailConditions(marksArray, attendance);
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
    let subjectHighest = {};

    let subjects = [];
    for (let subject of records[0]['marks']) {
        subjects.push(subject['subject']);
    }

    for (let s = 0; s < subjects.length; s++) {
        let currentSubject = subjects[s];

        let highestScore = 0;
        let topScorer = "";

        for (let i = 0; i < records.length; i++) {
            let student = records[i];

            for (let j = 0; j < student['marks'].length; j++) {
                let mark = student['marks'][j];

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

/* 5. Subject Wise Average subject and the average score. */
function subjectWiseAverage(records) {
    let subjectAverages = {};

    let subjects = [];
    for (let subject of records[0]['marks']) {
        subjects.push(subject['subject']);
    }

    let studentCount = records.length;

    for (let s = 0; s < subjects.length; s++) {
        let currentSubject = subjects[s];

        let totalScore = 0;

        for (let i = 0; i < records.length; i++) {
            let student = records[i];

            for (let j = 0; j < student['marks'].length; j++) {
                let mark = student['marks'][j];

                if (mark.subject === currentSubject) {
                    totalScore += mark['score'];
                }
            }
        }

        subjectAverages[currentSubject] = totalScore / studentCount;
    }

    return subjectAverages;
}

/* 6. Class topper using the results data generated from the generateResult function. 
    Logging the name and grade of the topper. Returning the record of the topper. */
function findClassTopper(studentResults) {
    let topper = studentResults[0];
    for (let i = 1; i < studentResults.length; i++) {
        if (studentResults[i].total > topper.total) {
            topper = studentResults[i];
        }
    }
    return topper;
}

/* 7. Modifying the generateResults function to utilize all the above functions and return a final record. */
function generateResults(records) {
    let results = [];

    let subjectHighest = subjectWiseHighest(records);
    let subjectAverages = subjectWiseAverage(records);

    for (let stu of records) {
        let student = stu;
        let marksArray = student['marks'];

        let total = calcTotalMarks(marksArray);
        let avg = calcAvgMarks(total, marksArray.length);
        let grade = assignGrade(avg, marksArray, student['attendance']);

        let result = {};

        result['name'] = student['name'];
        result['attendance'] = student['attendance'];
        result['total'] = total;
        result['average'] = avg;
        result['grade'] = grade;
        result['marks'] = student['marks'];

        results.push(result);
    }

    let topper = findClassTopper(results);

    return {
        results: results,
        subjectHighest: subjectHighest,
        subjectAverages: subjectAverages,
        topper: topper
    };
}

/* Modifying the displayResults function to display the results in a much more proper mannerism. */
function displayResults(data) {

    let results = data['results'];
    let subjectHighest = data['subjectHighest'];
    let subjectAverages = data['subjectAverages'];
    let topper = data['topper'];

    console.log("----- STUDENT RESULTS -----");

    for (let res of results) {
        console.log("|- Name:", res['name']);
        console.log("|- Attendance:", res['attendance']);
        console.log("|- Total:", res['total']);
        console.log("|- Average:", res['average']);
        console.log("|- Grade:", res['grade']);

        console.log("|- Marks:");
        for (let mark of res['marks']) {
            console.log("|- \t\t", mark.subject + ": " + mark.score);
        }

        console.log("----------------------");
    }

    console.log("\n----- SUBJECT HIGHEST -----");

    for (let subject in subjectHighest) {
        console.log(
            "Highest in " + subject + ": " +
            subjectHighest[subject].name + " (" +
            subjectHighest[subject].score + ")"
        );
    }

    console.log("\n----- SUBJECT AVERAGE -----");

    for (let subject in subjectAverages) {
        console.log(
            "Average " + subject + " Score: " +
            subjectAverages[subject]
        );
    }

    console.log("\n----- CLASS TOPPER -----");

    console.log(
        "Class Topper: " +
        topper['name'] + " with " +
        topper['total'] + " marks"
    );
}

results = generateResults(students);
displayResults(results);