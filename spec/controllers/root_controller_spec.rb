require 'minitest_helper'

describe Nchapp::RootController do
  include Rack::Test::Methods

  def app
    Nchapp::Application.new
  end

  describe 'GET /' do
    it 'must be ok' do
      get '/'
      last_response.must_be :ok?
      last_response.body.must_match /Hello Nchapp!/
    end
  end
end
