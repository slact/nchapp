#!/bin/ruby
if ENV["RACK_ENV"] == "development"
  system 'node node_modules/.bin/webpack --watch --debug&'
end

require File.expand_path('../config/application', __FILE__)

run Nchapp::Application.new
