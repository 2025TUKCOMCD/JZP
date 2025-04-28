import queue

def showq(q):
    try:
        while True:
            try:
                for i in range(q.qsize()):
                    print("Frame in Queue:")
                    print(q.qsize())
                    frame = q.get()
                    print(f"Frame {i + 1}: {frame}")
            except q.empty:
                print("queue is empty")
               
    except KeyboardInterrupt:
        print("\nInterrupted by user. Exiting function safely...")
