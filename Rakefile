require 'rake/testtask'

Rake::TestTask.new do |t|
  t.libs << 'spec'
  t.pattern = 'spec/**/*_spec.rb'
end

def nchan_git_pull
  Dir.chdir "gitdir/nchan/" do
    system "git reset --hard"
    system "git pull"
  end
end

desc 'Start a console'
task :console do
  ENV['RACK_ENV'] ||= 'development'
  require "pry"
  require "pry-debundle"
  Pry.debundle!

  require_relative 'config/application'

  ARGV.clear
  pry
end


desc 'rebuild static packages'
task :rebuild do
  ENV['RACK_ENV'] ||= 'development'
  require_relative 'config/application'
  ARGV.clear
  
  nchan_git_pull
  system "gitdir/nchan/dev/package/repackage.sh"
end

task default: :test
