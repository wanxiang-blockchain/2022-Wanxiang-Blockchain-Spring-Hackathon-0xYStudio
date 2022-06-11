import tweepy
import configparser
import pandas as pd

# read credentials from config file
config = configparser.ConfigParser()
config.read("config.ini")

ApiKey = config["twitter"]["ApiKey"]
ApiKeySecret = config["twitter"]["ApiKeySecret"]
AccessToken = config["twitter"]["AccessToken"]
AccessTokenSecret = config["twitter"]["AccessTokenSecret"]

# Authenticate
auth = tweepy.OAuthHandler(ApiKey, ApiKeySecret)
auth.set_access_token(AccessToken, AccessTokenSecret)

api = tweepy.API(auth)

PublicTweets = api.home_timeline(count=200)

columns = ["Time", "User", "Tweet"]
data = []

for tweet in PublicTweets:
    data.append([tweet.created_at, tweet.user.screen_name, tweet.text])

df = pd.DataFrame(data, columns=columns)

df.to_csv("TwitterFeed.csv")