from controller import ETLController
from apscheduler.schedulers.blocking import BlockingScheduler

import logging


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    scheduler = BlockingScheduler()
    controller = ETLController()
    scheduler.add_job(controller.update_movie_data, args=[203365, 1000000, 0])
    scheduler.add_job(controller.update_movie_data, args=[1172158, 2000000, 5])
    scheduler.add_job(controller.update_movie_data, args=[2033967, 3000000, 10])
    scheduler.add_job(controller.update_movie_data, args=[3052760, 4000000, 15])
    scheduler.start()
