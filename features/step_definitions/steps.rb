Given(/^the program has finished$/) do
  @cucumber = `node cli.js -e monkey; node cli.js -d 00091c080f5e12`
end

Then(/^the output is correct for each test$/) do
  lines = @cucumber.split("\n")

  lines.length.should == 2

  lines[0].should =~ /^[0-9]{2}[0-9a-f]+$/
  lines[1].should == 'monkey'
end
