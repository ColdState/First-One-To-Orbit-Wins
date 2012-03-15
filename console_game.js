# A pitiful attempt at a simple line-oriented game framework,
# which might be suitable for generalizing to a web implementation.

class ConsoleGame
  def initialize(game_state, game_config)
    @the_situation = game_state.new(game_config)
  end

  def run
    while @the_situation.running()
      # explain what the current situation is
      @the_situation.render()
      # put a little space in
      puts ""
      # explain what the options are
      verbs = @the_situation.get_available_verbs()
      verbs.render()
      # get a line of input
      input = gets.chomp
      verbs.obey(input)
    end
  end
end

# supports the ability to quit, which is frequently necessary in games.
class QuittableGameState
end

class MaybeQuit
  def initialize(situation)
    @situation = situation
  end

  def render()
    puts "Type Quit to quit"
  end

  def obey(input_line)
    if input_line == "Quit" then
      @situation.done()
    else
      puts "I'm sorry, I didn't understand that."
    end
  end
end

class MaybeBuyMiner
  def initialize(inventory, verbs)
    @inventory = inventory
    @verbs = verbs
  end

  def render()
    puts "Buy a miner to work for you. (B)"
    @verbs.render()
  end

  def obey(input_line)
    if input_line == "B" then
      @inventory.buy_miner()
    else
      @verbs.obey(input_line)
    end
  end
end

class Inventory < QuittableGameState
  def initialize(config)
    @running = true
    @gold = 100
    @idle_miners = 0
    @gold_miners = 0
    @fuel_miners = 0
    @fuel = 0
    @target_fuel = config['target_fuel']
  end

  def render
    puts "You have:"
    puts "  #{@gold} gold pieces,"
    puts "  #{@idle_miners} idle miners,"
    puts "  #{@gold_miners} miners working on mining gold, "
    puts "  #{@fuel_miners} miners working on mining fuel, "
    puts "  #{@fuel} gallons of fuel,"
    puts "And you need:"
    puts "  #{@target_fuel} gallons to leave the planet."
  end
      
  def get_available_verbs
    answer = MaybeQuit.new(self)
    if @gold > 50 then
      answer = MaybeBuyMiner.new(self, answer)
    end
    return answer
  end

  def running()
    return @running
  end

  def done()
    @running = false
  end

  def buy_miner()
    @gold -= 50
    @idle_miners += 1
  end
end

# actually do it
game = ConsoleGame.new(Inventory, {'target_fuel'=>10000})
game.run()
