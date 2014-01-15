Given(/^the program has finished$/) do
  @cucumber = `make test`
end

Then(/^the output is correct for each test$/) do
  lines = @cucumber.split("\n")

  lines.length.should == 4

  lines[0].should == 'node cli.js -e monkey'
  lines[1].should =~ /^[0-9]{2}[0-9a-f]+$/
  lines[2].should == 'node cli.js -d 00091c080f5e12'
  lines[3].should == 'monkey'
end
