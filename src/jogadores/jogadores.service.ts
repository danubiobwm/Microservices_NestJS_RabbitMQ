import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jogador.dto';
import { AtualizarJogadorDto } from './dto/atualizar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(JogadoresService.name);

  async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criarJogadorDto;
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      throw new BadRequestException(`Jogador com e-mail ${email} já cadastro`);
    }
    const jogadorCriado = new this.jogadorModel(criarJogadorDto);
    return await jogadorCriado.save();
  }

  async atualizarJogador(
    _id: string,
    atualizarJogadorDto: AtualizarJogadorDto,
  ): Promise<void> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
    }
    await this.jogadorModel
      .findOneAndUpdate({ _id }, { $set: atualizarJogadorDto })
      .exec();
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadoresPeloId(_id: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com ID: ${_id} not found`);
    }

    return jogadorEncontrado;
  }

  async deletarJogador(_id): Promise<any> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();
    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com ID: ${_id} not found`);
    }
    return await this.jogadorModel.deleteOne({ _id }).exec();
  }
}
