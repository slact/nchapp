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
task :rebuild do
  ENV['RACK_ENV'] ||= 'development'
  require_relative 'config/application'
  ARGV.clear
  
  nchan_git_pull
  system "gitdir/nchan/dev/package/repackage.sh"
  find_pkg :debian, "*.deb"
  find_pkg :tarball, "*.tar.gz"
end


task default: :test
