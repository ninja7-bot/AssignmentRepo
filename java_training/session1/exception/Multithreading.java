class myThread extends Thread {
    String name;
    
    myThread(String n) {
        name = n;
    }
    
    public void run() {
        for (int i = 1; i <= 5; i++) {
            System.out.println(name + ": " + i);
            try {
                Thread.sleep(500);
            } catch (Exception e) {
                System.out.println(e);
            }
        }
    }
}

class TestThread {
    public static void main(String[] args) {
        myThread t1 = new myThread("Thread 1");
        myThread t2 = new myThread("Thread 2");
        
        t1.start();
        t2.start();
    }
}