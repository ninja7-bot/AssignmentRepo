# Assignment Repo

Assignment repository for NucleusTeq training sessions.

## Git Practice

`git_practice` contains the Git practice files.

Branches under `git_practice`:
- `Git/Production` – Dummy production branch  
- `Git/Testing` – Deleted

## Linux Practice

`linux_practice` contains the scripts, files and directories created throughout the Linux sessions.

```
linux_practice/       (Root Repository Folder)
│
├── backup/           (Folder created in the Backup Script.)    
├── test_folder/             
└── scripts           (All the scripts and files.)
```

## Frontend Practice

`portfolio_frontend` contains the HTML, CSS, JS and Mini Project subdirectories created throughout the Frontend Practice sessions throughout the 3rd Week of March.

```
portfolio_frontend/       (Root Repository Folder)
│
├── html/                
│   ├── portfolio.html
│   └── image.jpg
├── css/             
│   └── style.css
├── js/                  
└── mini_app/            
```

## Java Assignment
### Session 1
Session 1 covers basic concepts of Java like OOPs, Datatypes, Exception Handling, File Handling and such. 

The directory contains java code files and markdown files for respective answers.

**Repo Structure**
```
java_assignment/        (Root Repository Folder)
│
├── collections/
│   ├── Anagram.java
│   ├── ArrayAverage.java
│   ├── CountVowel.java
│   ├── DataTypes.java
│   ├── Datatypes.MD
│   ├── LinearSearch.java
│   ├── ReverseString.java
│   └── SelectionSort.java
│
├── exception/
│   ├── ExceptionHandling.java
│   ├── FileHandling.java
│   └── Multithreading.java
│
├── generics/
│   ├── AreaCalculator.java
│   ├── EvenOdd.java
│   ├── EvenSum.java
│   ├── Factorial.java
│   ├── Fibonacci.java
│   ├── LargestNumber.java
│   ├── MultiplicationTable.java
│   ├── Operators.java
│   ├── PrimeNumber.java
│   ├── TemperatureConverter.java
│   └── TrianglePattern.java
│
└── oop/
    ├── Abstract.MD
    ├── Encapsulation.java
    ├── Encapsulation.md
    ├── GraduateStudent.java
    ├── Polymorphism.java
    └── Student.java
```

### Session 2: Student Management System

A basic Spring Boot project to manage students using REST APIs and in-memory data.

**Repo Structure**

```
java_training/session2/
└── student-management-system
    ├── StudentManagementApplication.java
    ├── model/
    │   └── Student.java
    ├── repository/
    │   └── StudentRepository.java
    ├── service/
    │   ├── StudentService.java
    │   ├── NotificationService.java
    │   └── MessageService.java
    ├── controller/
    │   ├── StudentController.java
    │   ├── NotificationController.java
    │   ├── MessageController.java
    │   └── GlobalExceptionHandler.java
    └── component/
        ├── NotificationComponent.java
        ├── ShortMessageFormatter.java
        └── LongMessageFormatter.java
```

### Session 3: Employee Management System

A Spring Boot REST API project to manage employees with search, add, and delete operations.

**Repo Structure**

```
java_training/session3/
└── employee-management-system
    ├── EmployeeManagementApplication.java
    ├── model/
    │   └── Employee.java
    ├── repository/
    │   └── EmployeeRepository.java
    ├── service/
    │   └── EmployeeService.java
    └── controller/
        ├── EmployeeController.java
        └── GlobalExceptionHandler.java
```

### Session 4: Task Manager

A Spring Boot based Task Manager or To Do List Project.

**Repo Structure**

```
java_training/session4/
└── TaskManager
    ├── TaskManagerApplication.java
    ├── client/
    │   └── NotificationClient.java
    ├── repository/
    │   └── TaskRepository.java
    ├── dto/
    │   └── TaskDTO.java
    ├── entity/
    │   └── Tasks.java
    ├── enums/
    │   └── TodoStatus.java
    ├── service/
    │   └── TaskService.java
    └── controller/
        ├── TaskController.java
        └── GlobalExceptionHandler.java
```

### Session 5: Task Manager Test Cases

A Spring Boot based Task Manager or To Do List Project. Use SLF4J Logger and JUnit, Mockito Testing.

**Repo Structure**

```
java_training/session4/
└── TaskManager
    ├── TaskManagerApplicationTest.java
    │
    ├── service/
    │   └── TaskServiceTest.java
    └── controller/
        └── TaskControllerTest.java
```

## Capstone: Event Ticketing System

Event Ticketing System is a full-stack, Java, Spring Boot, MySQL, HTML, CSS, JS (Vanilla) project built within a 10 day duration as part of a Capstone Project.


## Python Training

### Python Basics
Python Basics covers concepts like Variables, Datatypes, Operators, Conditionals, Loops and such concepts.

**Repo Structure**
```
python_training/
│
├── .gitignore
├── README.md
│
├── python_basic/
│   ├── __init__.py
│   │
│   ├── intro.py
│   │
│   ├── datatypes/
│   │   ├── datatypesQ4.py
│   │   ├── datatypesQ5.py
│   │   └── datatypesQ6.py
│   │
│   ├── operators/
│   │   ├── operatorsQ7.py
│   │   ├── operatorsQ8.py
│   │   ├── operatorsQ9.py
│   │   ├── operatorsQ10.py
│   │   └── operatorsQ11.py
│   │
│   ├── loops/
│   │   ├── loopsQ12.py
│   │   ├── loopsQ13.py
│   │   ├── loopsQ14.py
│   │   ├── loopsQ15.py
│   │   └── loopsQ16.py
│   │
│   ├── functions/
│   │   ├── functionQ17.py
│   │   ├── functionQ18.py
│   │   ├── functionQ19.py
│   │   └── functionQ20.py
│   │
│   ├── modules/
│   │   └── printModule.py
│   ├── modules.py
|   |
│   ├── collections/
│   │   │
│   │   ├── list/
│   │   │   ├── listQ25.py
│   │   │   └── listQ26.py
│   │   │
│   │   ├── tupleQ28_Q29.py
│   │   │
│   │   ├── setsQ30_Q31.py
│   │   │
│   │   └── dict/
│   │       ├── dictQ32.py
│   │       ├── dictQ33.py
│   │       └── dictQ34.py
│   │
│   ├── filehandling/
│   │   ├── filehandlingQ35.py
│   │   ├── filehandlingQ36.py
│   │   ├── filehandlingQ37.py
│   │   ├── filehandlingQ38.py
│   │   ├── filehandlingQ39.py
│   │   └── txtfile.txt
│   │
│   └── exception/
│
└── oop/
    ├── oopQ40.py
    ├── oopQ41.py
    ├── oopQ42.py
    ├── oopQ43.py
    └── oopQ44.py
```