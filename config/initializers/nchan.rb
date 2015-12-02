require "git"

def init_nchan_git_repo
  Git.clone("https://github.com/slact/nchan.git", 'nchan', :path => "gitdir")
end

def check_nchan
  begin
    g = Git.open("gitdir/nchan")
  rescue ArgumentError => e
    init_nchan_git_repo
    check_nchan
  end
  
  g.pull
  
end
  
check_nchan