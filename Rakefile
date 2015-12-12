require 'rake/testtask'

Rake::TestTask.new do |t|
  t.libs << 'spec'
  t.pattern = 'spec/**/*_spec.rb'
end

def find_pkg(name, glob)
Dir.chdir "gitdir/nchan/dev/package/pkgs/" do 
    cp = CompiledPackage.get(name)
    found = Dir.glob(glob).first
    if found
      cp.filename = found;
      cp.save
    else
      cp.delete
    end
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
task :repackage do
  build_key = "Nchan:nchapp:nchan_last_build"
  
  ENV['RACK_ENV'] ||= 'development'
  require_relative 'config/application'
  ARGV.clear
  
  last_build=Queris.redis.get build_key
  current_commit=Nchapp::Application.nchan_current_commit
  
  if last_build != current_commit
    puts "old build: #{last_build}"
    puts "new ver:   #{current_commit}"
    puts "should rebuild."
    system "gitdir/nchan/dev/package/repackage.sh"
    find_pkg :debian, "*.deb"
    find_pkg :tarball, "*.tar.gz"
    Queris.redis.set build_key, current_commit
  else
    puts "on latest build #{current_commit}"
  end
  
end



desc 'update documentation to nchan master'
task :update do
  ENV['RACK_ENV'] ||= 'development'
  require_relative 'config/application'
  ARGV.clear
end

task default: :test
