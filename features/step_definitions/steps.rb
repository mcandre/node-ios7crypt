Given(/^the program has finished$/) do
  @cucumber = `node cli.js -e monkey; node cli.js -d 00091c080f5e12`
end

Then(/^the output is correct for each test$/) do
  lines = @cucumber.split("\n")

  expect(lines.length).to eq(2)

  expect(lines[0]).to match(/^[0-9]{2}[0-9a-f]+$/)
  expect(lines[1]).to eq('monkey')
end
