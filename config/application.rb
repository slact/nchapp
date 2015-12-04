require 'bundler'
require 'securerandom'
require "yaml"
require "queris"

Bundler.require :default, ENV['RACK_ENV'].to_sym

module Nchapp
  class Application < Hobbit::Base
    include Hobbit::Filter
    include Hobbit::Environment
    include Hobbit::Session
    
    #load config
    all_conf=YAML.load_file 'config/env.yml'
    conf=all_conf[ENV['RACK_ENV']]
    @@config=conf
    def config
      @@config
    end
    
    #initialize sprunger client
    Queris.add_redis Redis.new(url: conf["redis_url"])
    #Queris.log_stats_per_request!
    
    use Rack::Config do |env|
      all_conf[ENV['RACK_ENV'].to_s].each do |cf, val|
        env[cf.to_sym]=val
      end
    end
    
    (Dir['config/initializers/**/*.rb'] + 
     Dir['app/controllers/**/*.rb'] +
     Dir['app/models/**/*.rb']).each do |file| 
      require File.expand_path(file)
    end

    if development?
      use PryRescue::Rack
      #use BetterErrors::Middleware
    end
    use Rack::Session::Redis
    # must be used after Rack::Session::Cookie
    use Rack::Protection, except: :http_origin
    
    #static resources
    use Rack::Static, root: 'app/assets/', urls: ['/js', '/css', '/img', '/icons']
    
    #packages
    use Rack::Static, root: 'gitdir/nchan/dev/package/', urls: ['/pkgs']
  end
end

require File.expand_path('config/routes.rb')
