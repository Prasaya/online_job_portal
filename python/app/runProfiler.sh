python profiler.py > profiler.log;
gprof2dot --format=callgrind --output=out.dot ./stats.callgrind;
dot -Tpng out.dot -o graph.png;
