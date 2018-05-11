require 'rake/testtask'

Rake::TestTask.new do |t|
  t.libs << 'spec'
  t.pattern = 'spec/**/*_spec.rb'
end

def find_pkg(dir, name, glob)
  Dir.chdir dir do 
    cp = CompiledPackage.get(name)
    globs = Dir.glob(glob)
    if block_given?
      found = yield globs
    else
      found = globs.first
    end
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

namespace :parcel do

  desc "npm install parcel and friends. Assumes package.js and such already exist."
  task :install do |task|
    `npm install`
  end

  desc "watch for changes in dev mode"
  task :dev do |task|
    system 'parcel --watch --debug'
  end

  desc "build assets for production use"
  task :release do |task|
    system 'parcel build --log-level 3 --detailed-report --public-url /js/ -d app/assets/js/ app/js/*'
  end
end

desc 'rebuild static packages'
task :repackage do
  build_key = "Nchan:nchapp:nchan_last_build"
  
  gitdir_pkgs="gitdir/nchan/dev/package/pkgs"
  prebuilt_pkgs='app/assets/packages'
  
  ENV['RACK_ENV'] ||= 'development'
  require_relative 'config/application'
  ARGV.clear
  
  find_pkg prebuilt_pkgs, :'nginx-common.deb', "nginx-common*.deb" do |ls|
    ls.reject! { |f| f =~ /ubuntu/ }
    ls.first
  end  
  find_pkg prebuilt_pkgs, :'nginx-extras.deb', "nginx-extras*.deb" do |ls| 
    ls.reject! { |f| f =~ /ubuntu/ }
    ls.first
  end

  find_pkg prebuilt_pkgs, :'nginx-common.ubuntu.deb', "nginx-common*ubuntu*.deb"
  find_pkg prebuilt_pkgs, :'nginx-extras.ubuntu.deb', "nginx-extras*ubuntu*.deb"
  
  find_pkg prebuilt_pkgs, :'nginx-mod-nchan.rpm', "nginx-mod-nchan*.x86_64.rpm"
  find_pkg prebuilt_pkgs, :'nginx-mod-nchan.src.rpm', "nginx-mod-nchan*.src.rpm"
  
  last_build=Queris.redis.get build_key
  current_commit=Nchapp::Application.nchan_current_commit
  
  if last_build != current_commit
    puts "old build: #{last_build}"
    puts "new ver:   #{current_commit}"
    puts "should rebuild."
    system "gitdir/nchan/dev/package/repackage.sh"
    #find_pkg gitdir_pkgs, :debian, "*.deb"
    find_pkg gitdir_pkgs, :tarball, "*.tar.gz"
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
