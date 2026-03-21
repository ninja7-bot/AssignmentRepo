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
        return totalMarks/subCount
    }
}

/* Fail conditions check for low attendance and score. */
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

/* Grades based on scores. */
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

/* TESTING PURPOSES ONLY!
// totalMarks dictionary used to store records for each student. 
totalMarks = {}

for (stu of students){
    student = stu['name']
    marksArr = stu['marks']
    total = calcTotalMarks(marksArr)
    totalMarks[student] = total
}

// Displaying the records. 
console.log("-----TOTAL MARKS RECORDS-----")

for (rec in totalMarks){
    console.log("|- ", rec, totalMarks[rec])
}

for (stu of students){
    count = stu['marks'].length
    console.log(stu['name'], calcAvgMarks(totalMarks[stu['name']], count))
}


for (stu of students) {
    total = calcTotalMarks(stu.marks);
    avg = calcAvgMarks(total, stu.marks.length);

    grade = assignGrade(avg, stu.marks, stu.attendance);

    console.log(stu.name + " Grade:", grade);
    console.log(stu['name'], checkFailConditions(stu['marks'], stu['attendance']))
}

*/