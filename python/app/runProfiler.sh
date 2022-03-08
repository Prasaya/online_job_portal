time python profiler.py
gprof2dot --format=callgrind --output=out.dot ./stats.callgrind;
dot -Tpng out.dot -o graph.png;
