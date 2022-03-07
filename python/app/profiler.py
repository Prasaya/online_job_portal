import asyncio
from SkillParser import SkillParser
import json
import yappi
import sys
# gprof2dot --format=callgrind --output=out.dot ./stats.callgrind; dot -Tpng out.dot -o graph.png

async def main():
    yappi.set_clock_type('WALL')
    skill = SkillParser()
    data1 = await skill.parse(['python', 'C++', 'Django', 'Nodejs'])
    yappi.start()
    data2 = await skill.parse([
        "Coordinate and responsible for the company's HR work",
        "Responsible for Nepalese's labour policy implementation and HR outreach work",
        "Responsible for the formulation of Nepalese's local HR policy, and the promotion and implementation of important work tasks",
        "Responsible for Nepalese's staff recruitment & allocation, compensation & benefits, and performance management",
        "Responsible for Nepalese staffs' remuneration calculation and salary data statistics",
        "Responsible for post & designation management, post & designation adjustment, post & designation transfer, etc.",
        "Responsible for Nepalese's staff training, and cultural integration policy formulation",
        "Responsible for HR team building and individual training",
        "Responsible for department internal audit",
        "Responsible for the preparation of company's manpower cost budget"
    ])
    # data2 = await skill.parse(['python', 'C++', 'writing', 'design', 'Django', 'Nodejs'])
    # data3 = await skill.parse(['python', 'C++', 'writing', 'design', 'Django', 'Nodejs'])
    # data4 = await skill.parse(['python', 'C++', 'writing', 'design', 'Django', 'Nodejs'])
    # data5 = await skill.parse(['python', 'C++', 'writing', 'design', 'Django', 'Nodejs'])
    yappi.stop()
    # stats = yappi.get_func_stats(
    #     filter_callback=lambda x: 'Esco' in x.module or 'DBPedia' in x.module)
    stats = yappi.get_func_stats()
    stats.save('stats.callgrind', type='callgrind')
    stats.print_all()
    await skill.close()


if __name__ == '__main__':
    asyncio.run(main())
