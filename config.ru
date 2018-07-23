#!/bin/ruby
if ENV["RACK_ENV"] == "development"
  require "process_exists"
  if File.file?("./parcel.pid") && Process.exists?(File.read("./parcel.pid"))
    puts "Parcel already running on pid #{File.read("./parcel.pid")}"
  else
    pid = spawn 'parcel watch --log-level 3 --out-dir app/assets/js/ --public-url /js/ ./app/js/'
    File.write("./parcel.pid", pid)
    puts "Running parcel with pid #{pid}"
  end
else
  require "process_exists"
  if File.file?("./parcel.pid") && Process.exists?(File.read("./parcel.pid"))
    pid = File.read("./parcel.pid").to_i
    Process.kill(15, pid)
    puts "killed Parcel process #{pid}"
    File.delete("./parcel.pid")
  end
end
puts File.expand_path('../config/application', __FILE__)
require File.expand_path('../config/application', __FILE__)
run Nchapp::Application.new
