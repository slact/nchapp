require 'bundler'
require 'securerandom'
require "yaml"
require "queris"
require "halfling"

Bundler.require :default, ENV['RACK_ENV'].to_sym

module Nchapp
  class Application < Hobbit::Base
    #include Hobbit::Session
    #include Hobbit::Filter
    
    #use Rack::MethodOverride
    
    if development?
      #use PryRescue::Rack
      use BetterErrors::Middleware
    end
    #use Rack::Session::Redis
    # must be used after Rack::Session::Cookie
    #use Rack::Protection, except: :http_origin
      
    #convenience methods
    def user
      env['warden'].user
    end
    def nchan_dir
      "gitdir/nchan"
    end
    
    attr_reader :page_title
    def set_title(title)
      @page_title=title
    end
    
    [:footer, :contents].each do |pageElement|
      attr_accessor "no_#{pageElement}"
      define_method("no_#{pageElement}!") { send("no_#{pageElement}=", true) }
    end
    def show_announcements!
      @show_announcements = true
    end
    
    #static resources
    use Rack::Static, root: 'app/assets/', urls: ['/js', '/css', '/img', '/icons', '/documents']
    
    #packages
    use Rack::Static, root: 'gitdir/nchan/dev/package/', urls: ['/pkgs']
    use Rack::Static, root: 'app/assets/', urls: ['/packages']

  end
end
