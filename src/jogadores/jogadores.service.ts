import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;

    /*   const jogadorEncontrado = this.jogadores.find(
        (jogador) => jogador.email === email,
      ); */
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      await this.atualizar(criarJogadorDto);
    } else {
      await this.criar(criarJogadorDto);
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    // return await this.jogadores;
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com e-mail ${email} not found`);
    }

    return jogadorEncontrado;
  }

  async deletarJogador(email): Promise<any> {
    /* const jogadorEncontrado = this.jogadores.find(
      (jogador) => jogador.email === email,
    ); */

    /*  this.jogadores = this.jogadores.filter(
       (jogador) => jogador.email !== jogadorEncontrado.email,
     ); */
    return await this.jogadorModel.remove({ email }).exec();
  }

  private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const jogadorCriado = new this.jogadorModel(criarJogadorDto);
    return await jogadorCriado.save();

    /* const { nome, email, telefoneCelular } = criarJogadorDto;
    const jogador: Jogador = {
      nome,
      telefoneCelular,
      email,
      ranking: 'A',
      posicaoRanking: 1,
      urlFotoJogador: 'www.google.com.br/fotosx.jpg',
    };
    this.logger.log(`criarJogadorDto:${JSON.stringify(jogador)}`);
    this.jogadores.push(jogador); */
  }
  private async atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    return await (
      await this.jogadorModel.findOneAndUpdate(
        { email: criarJogadorDto.email },
        { $set: criarJogadorDto },
      )
    ).execPopulate();
    /*  const { nome } = criarJogadorDto;
     jogadorEncontrado.nome = nome; */
  }
}
