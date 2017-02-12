from urllib import request, error
from bs4 import BeautifulSoup
import json
import html
import datetime
import data.utils as utils


class Extractor:

    trakt_header = {
      'Content-Type': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': '411a8f0219456de5e3e10596486c545359a919b6ebb10950fa86896c1a8ac99b'
    }

    wemakesites_api_key = "5a7e0693-af96-4d43-89a3-dc8ca00cf355"

    imdb_url_format = "http://www.imdb.com/title/{}/"

    # omdb setup
    omdb_plot_option = "full"  # attribute for omdb

    omdb_content_type = "json"  # return type for omdb requests

    # douban
    douban_url_format = "https://movie.douban.com/subject_search?search_text={}"
    metacritic_url_format = "http://www.metacritic.com/search/movie/{}/results"

    def __init__(self, logger):
        self.logger = logger

    # ==========
    #   data
    # ==========
    def extract_imdb_data(self, movie_id):
        """
        given imdb_id, return the current rating and total number of votes of this movie in imdb database
        :param movie_id:
        :return: rating and votes in STRING format or False if it is a bad request
        """
        url = self.imdb_url_format.format(movie_id)

        try:
            request_result = request.urlopen(url).read()
        except error.HTTPError:
            self.logger.warning("Movie id is not valid:" + movie_id)
            return False

        soup = BeautifulSoup(request_result, "lxml")  # soup builder

        type = self.extract_type(soup)
        production_year, title = self.extract_title_and_year(soup)
        country, genre, rated, released, runtime = self.extract_subtext(soup, movie_id)
        plot = self.extract_plot(soup)
        actor, director = self.extract_credits(soup)
        poster_url = self.extract_poster(soup)

        movie_data = utils.get_movie_data_dict(actor, country, director, genre, movie_id, None,
                                               plot, poster_url, production_year, rated, released, runtime, title, type)

        return movie_data




    # ==========
    #   rating
    # ==========
    def extract_trakt_rating(self, movie_id):
        """
        given imdb_id, return the current rating and total number of votes of this movie in trakt.tv database
        :param movie_id:
        :return: rating and votes in STRING format
        """
        request_result = request.Request('https://api.trakt.tv/movies/{}/ratings'.format(movie_id),
                                          headers=self.trakt_header)
        try:
            json_result = json.loads(request.urlopen(request_result).read().decode("utf-8"))
        except error.HTTPError:
            self.logger.error("Rating is not available in Trakt")
            return None, None

        return str(json_result['rating']), str(json_result['votes'])

    def extract_imdb_rating(self, movie_id):
        """
        given imdb_id, return the current rating and total number of votes of this movie in imdb database
        :param movie_id:
        :return: rating and votes in STRING format
        """
        url = self.imdb_url_format.format(movie_id)
        request_result = request.urlopen(url).read()
        soup = BeautifulSoup(request_result, "lxml")
        div = soup.find('div', {'class': 'ratingValue'})

        try:
            parse_list = div.find("strong")['title'].split(" based on ")
        except AttributeError:
            self.logger.error("Rating is not available in IMDb.")
            return None, None

        rating = parse_list[0]
        votes = parse_list[1].split(" ")[0].replace(",", "")
        return rating, votes

    def extract_douban_rating(self, movie_id):
        """
        given imdb_id, return the current rating and total number of votes of this movie in douban database
        :param movie_id:
        :return: rating and votes in STRING format
        """
        url = self.douban_url_format.format(movie_id)
        request_result = request.urlopen(url).read()
        soup = BeautifulSoup(request_result, "lxml")

        try:
            rating = soup.find("span", {'class': 'rating_nums'}).text
            votes = soup.find("span", {'class': 'pl'}).text.replace("人评价","")[1: -1].replace(",", "")  # remove parenthesis and words
        except AttributeError:
            self.logger.error("Rating is not available in Douban.")
            return None, None

        return rating, votes

    def extract_metacritic_rating(self, imdb_id, search_string, director, release_date):
        # bad request, on hold, need to use selenium
        url = self.metacritic_url_format.format(html.escape(search_string))
        call_result = request.urlopen(url).read()
        soup = BeautifulSoup(call_result, "lxml")
        results = soup.find('li', {'class': 'result'})
        print(results)
        pass

    def extract_rotten_tomatoes_rating(self, imdb_id):
        pass

    def extract_letterboxd_rating(self, movie_id):
        pass

    # ===========
    #   showing
    # ===========
    def extract_popcorn_showing(self):
        pass

    # private
    def extract_poster(self, soup):
        """
        return the url of poster of one movie
        :param movie_id:
        :param soup: url in string format or None
        :return:
        """
        poster = soup.find("div", {"class": "poster"})
        try:
            poster_url = poster.find("img")['src']
        except AttributeError:
            poster_url = None
        return poster_url

    def extract_credits(self, soup):
        """
        return the directors and actors of the movie. If there is more than
        one director or actor, it will display a string with multiple tokens,
        separated by comma
        :param soup:
        :return: credits info in string format or None
        """
        credits_text = soup.find_all("div", {"class": "credit_summary_item"})
        director, actor = None, None
        for item in credits_text:
            current_text = item.text
            if "Directors:" in current_text:
                director = current_text.replace("Directors:", "").replace("\n", "").replace("  ", "")
            elif "Director:" in current_text:
                director = current_text.replace("Director:", "").strip()
            elif "Stars" in current_text:
                actor = current_text.replace("Stars:", "").split("|")[0].replace("\n", "").replace("  ", "")
            elif "Star" in current_text:
                actor = current_text.replace("Star:", "").strip()
        return actor, director

    def extract_plot(self, soup):
        """
        return the plot of one movie
        :param soup:
        :return: plot in string format or None
        """
        plot = soup.find("div", {"class": "summary_text"}).text.replace("\n", "").strip().split("    ")[0]
        if "Add a Plot" in plot:
            plot = None
        return plot

    def extract_subtext(self, soup, movie_id):
        """
        return the rating, run time, genre, release date and country of origin of a movie
        :param soup:
        :return: rated, runtime, genre and country are in string
                format or None, released date is in date format or None
        """
        rated, runtime, genre, release, country = None, None, None, None, None  # initialisation
        subtext = soup.find("div", {"class": "subtext"}).text.replace("\n", "").strip().split("|")  # unpack subtext
        type_text = subtext[-1]  # type inference

        if "Episode aired" in type_text:
            type = "episode"
            if len(subtext) == 4:
                rated, runtime, genre, release = subtext
            elif len(subtext) == 3:
                runtime, genre, release = subtext
            elif len(subtext) == 2:
                runtime, release = subtext
            else:
                self.logger.critical(subtext, movie_id)
                raise Exception("Examine the output")

            # cleaning process
            runtime = self.imdb_runtime_to_mins(runtime)
            release = self.release_to_episode_release(release)
            return country, genre, rated, release, runtime, type

        elif "TV Series" in type_text:
            type = "tv"
            self.logger.debug("this is tv")
            subtext = subtext[:-1] # ignore last token
            if len(subtext) == 3:
                rated, runtime, genre = subtext
            elif len(subtext) == 2:
                runtime, genre = subtext
            elif len(subtext) == 1:
                runtime = subtext
            else:
                self.logger.critical(subtext, movie_id)
                raise Exception("Examine the output")

            # cleaning process
            runtime = self.imdb_runtime_to_mins(runtime)
            return country, genre, rated, release, runtime, type
        else:
            type = "movie"


        # return
        #
        # if len(subtext) == 3:
        #     runtime, genre, release_country = subtext
        # elif len(subtext) == 2:  # either runtime + genre or genre + release_country
        #     if 'min' in subtext[0]:  # runtime plus genre
        #         runtime, genre = subtext
        #     else:
        #         genre, release_country = subtext
        # elif len(subtext) == 1:
        #     genre = subtext[0]
        #     release_country = None
        # elif len(subtext) == 4:
        #     rated, runtime, genre, release_country = subtext
        # else:
        #     print(subtext)
        #     raise Exception("Examine the output")
        #
        # if release_country is not None:
        #     released, country = release_country.replace(")", "").split("(")
        #     released = released.strip()  # remove last white space
        #     length_of_date = len(released.split(" "))
        #     if length_of_date == 3:
        #         released = datetime.datetime.strptime(released, '%d %B %Y').strftime('%Y-%m-%d')
        #     elif length_of_date == 2:
        #         released = datetime.datetime.strptime(released, '%B %Y').strftime('%Y-%m-%d')
        #     elif length_of_date == 1:
        #         released = datetime.datetime.strptime(released, '%Y').strftime('%Y-%m-%d')
        # else:
        #     released = None
        #     country = None
        #
        # return country, genre, rated, released, runtime

    def release_to_episode_release(self, release):
        release = release.replace("Episode aired", "").strip()  # remove last white space
        length_of_date = len(release.split(" "))
        release = datetime.datetime.strptime(release, '%d %B %Y').strftime('%Y-%m-%d')
        return release

    def imdb_runtime_to_mins(self, runtime):
        runtime = runtime.replace(" ", "").replace("min", "")
        if "h" in runtime:
            [hours, minutes] = runtime.split("h")
            if minutes == "":
                minutes = 0
            runtime = int(hours) * 60 + int(minutes)
        return str(runtime)

    def extract_title_and_year(self, soup):
        """
        return title and production year of a movie
        :param soup:
        :return: title in string or None, production year in integer or None
        """
        title_wrapper = soup.find("h1").text.split("\xa0")
        title = title_wrapper[0]
        production_year = title_wrapper[1].replace("(", "").replace(")", "").replace(" ", "")
        if production_year == "":
            return None, title
        return int(production_year), title

    def extract_type(self, soup):
        if self.is_episode(soup):
            return "episode"
        else:
            return None

