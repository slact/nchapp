#!/usr/bin/ruby
source 'https://rubygems.org'
gem 'json'
gem 'cuba'
gem 'roda'
gem 'syro'
gem 'unicorn'

gem 'scrypt'

gem 'redcarpet'
gem 'pygments.rb'

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

group :development do
  gem "pry"
  gem "pry-coolline"
  gem "pry-doc"
  gem "pry-remote"
  #gem "pry-rescue"
  gem "pry-git"
  gem "pry-theme"
  gem 'pry-debundle'
  gem "pry-byebug", "~> 1.3.3"
  
  #gem 'awesome_print'
  gem 'better_errors', git: 'https://github.com/grekko/better_errors.git'
  gem 'binding_of_caller'
  gem 'rake'
end

group :test do
  gem 'minitest', require: 'minitest/autorun'
  gem 'minitest-reporters'
  gem 'rack-test', require: 'rack/test'
end
