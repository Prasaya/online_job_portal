import asyncio
from SkillParser import SkillParser
import json
import yappi
import sys
from app import main as app_main
# gprof2dot --format=callgrind --output=out.dot ./stats.callgrind; dot -Tpng out.dot -o graph.png


asyncio.run(app_main())
yappi.set_clock_type('wall')
yappi.clear_stats()
yappi.start()
asyncio.run(app_main())
yappi.stop()
stats = yappi.get_func_stats(
    filter_callback=lambda x: 'Esco' in x.module or 'DBPedia' in x.module)
stats = yappi.get_func_stats()
stats.save('stats.callgrind', type='callgrind')
with open('profiler.log', 'w') as f:
    stats.print_all(out=f)
