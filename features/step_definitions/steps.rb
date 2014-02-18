Given(/^the program has finished$/) do
  @cucumber = `grunt --no-color`
end

Then(/^the output is correct for each test$/) do
  lines = @cucumber.split("\n")

  lines.length.should == 7

  lines[0].should == 'Running "exec:encrypt" (exec) task'
  lines[1].should =~ /^[0-9]{2}[0-9a-f]+$/
  lines[2].should == ''
  lines[3].should == 'Running "exec:decrypt" (exec) task'
  lines[4].should == 'monkey'
  lines[5].should == ''
  lines[6].should == 'Done, without errors.'
end
