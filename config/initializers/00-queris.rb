require "queris"
module Nchapp
  Queris.add_redis Redis.new(url: Application.config["redis_url"])
  #Queris.log_stats_per_request!
end
