import time


def measure_execution_time(function, *args, **kwargs):
    start_time = time.time()
    result = function(*args, **kwargs)
    end_time = time.time()

    execution_time = end_time - start_time

    return execution_time, result
