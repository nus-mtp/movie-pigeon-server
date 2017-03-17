"""
    Testing of movie schedule is not the priority since the schedule is changing everyday.
    And it takes a lot of time to parse it
"""

from cinema import CinemaSchedule

import unittest


class TestCinemaSchedule(unittest.TestCase):

    def setUp(self):
        self.gv_schedule = CinemaSchedule('GV Tiong Bahru', 'https://www.gv.com.sg/GVCinemaDetails#/cinema/03', "gv")
        self.cathay_schedule = CinemaSchedule('The Cathay Cineplex', 'http://www.cathaycineplexes.com.sg/showtimes/',
                                              "cathay")
        self.shaw_schedule = CinemaSchedule('Shaw Theatres Lido', 'http://www.shaw.sg/sw_buytickets.aspx?'
                                                                  'filmCode=&cplexCode=30 210 236 39 155 56 75 124 '
                                                                    '123 77 76 246 36 85 160 0&date=', "sb")


