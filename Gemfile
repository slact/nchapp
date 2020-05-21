#!/usr/bin/ruby
source 'https://rubygems.org'
gem 'json'
gem 'cuba'
gem 'roda'
gem 'syro'
gem 'unicorn'

gem 'redcarpet'
gem 'pygments.rb'

gem "process_exists"

gem 'git'
gem 'fpm', :git => "https://github.com/slact/fpm.git"

#rack stuff
gem 'warden'
gem 'rack-contrib'
gem 'rack-abstract-format'
gem 'rack-respond_to'
gem 'rack-referrals'
gem 'muster'
gem 'rack-attack'
gem 'chrome_logger'
gem 'rack-detect-tor'
gem 'haml'
gem 'racksh'
gem 'redis-rack'

#rack reloader
gem "mr-sparkle"

gem "redd"

gem 'hiredis'
gem 'redis', :require => ["redis/connection/hiredis", "redis"]

gem 'queris', git: "https://github.com/slact/queris.git"

gem 'i18n'
gem "halfling"
gem "erubis"

group :development do
  gem "irb"
  gem "pry"
  gem "pry-coolline"
  gem "pry-doc"
  gem "pry-remote"
  #gem "pry-rescue"
  gem "pry-git"
  gem "pry-theme"
  gem 'pry-debundle'
  gem "pry-byebug"
  
  #gem 'awesome_print'
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'rake'
end

group :test do
  gem 'minitest', require: 'minitest/autorun'
  gem 'minitest-reporters'
  gem 'rack-test', require: 'rack/test'
end
