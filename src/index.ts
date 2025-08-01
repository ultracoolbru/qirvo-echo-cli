#!/usr/bin/env node

// Firebase config is now hardcoded in FirebaseAuthService
// No need for environment variable loading for Firebase

import { Command } from 'commander';
import chalk from 'chalk';
import { TaskCommand } from './commands/TaskCommand';
import { GitCommand } from './commands/GitCommand';
import { AgentCommand } from './commands/AgentCommand';
import { MemoryCommand } from './commands/MemoryCommand';
import { LogsCommand } from './commands/LogsCommand';
import { ConfigCommand } from './commands/ConfigCommand';
import { RemoteCommand } from './commands/RemoteCommand';
import { ConfigService } from './services/ConfigService';
import * as packageJson from '../package.json';
import { ApiService } from './services/ApiService';

const program = new Command();

// Initialize services
const configService = new ConfigService();
const apiService = new ApiService(configService);

// Initialize commands
const taskCommand = new TaskCommand(apiService);
const gitCommand = new GitCommand(apiService);
const agentCommand = new AgentCommand(apiService);
const memoryCommand = new MemoryCommand(apiService);
const logsCommand = new LogsCommand(apiService);
const configCommand = new ConfigCommand(configService, apiService);
const remoteCommand = new RemoteCommand(apiService, configService);

// Configure main program
program
  .name('e')
  .description('Echo CLI - Command-line interface for task management, Git operations, and AI assistance')
  .version(packageJson.version);

// Add commands
program.addCommand(taskCommand.getCommand());
program.addCommand(gitCommand.getCommand());
program.addCommand(agentCommand.getCommand());
program.addCommand(memoryCommand.getCommand());
program.addCommand(logsCommand.getCommand());
program.addCommand(configCommand.getCommand());
program.addCommand(remoteCommand.getCommand());

// Add version command
program
  .command('version')
  .description('Show version information')
  .action(() => {
    console.log(chalk.cyan(`Echo CLI v${packageJson.version}`));
    console.log(chalk.gray('Built for Qirvo Dashboard Integration'));
    console.log();
    console.log(chalk.yellow('Commands available:'));
    console.log('  task     - Task management');
    console.log('  git      - Git operations');
    console.log('  agent    - AI assistance');
    console.log('  memory   - Memory management');
    console.log('  logs     - Session logs');
    console.log('  config   - Configuration');
    console.log('  remote   - Remote command execution');
    console.log();
    console.log(chalk.gray("Use 'e <command> --help' for more information about a command."));
  });

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red(`Invalid command: ${program.args.join(' ')}`));
  console.log(chalk.yellow("Use 'e --help' for available commands."));
  process.exit(1);
});

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
