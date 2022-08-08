import { Inject, Service } from '@tsed/di'
import { Amqp, Messenger } from '../../../..'
import { PrismaService } from './PrismaServiceService'

@Service()
export class FileInformationService {

  @Inject()
  private prisma: PrismaService

  @Amqp('informations')
  async getFileInformation(filePath: any) {
    return { filePath }
  }

  async getDirectoryInformation() {
    const result = await Messenger.invoke('typedi-example.informations', { test: '121' })
    console.log(result)
    return
  }

  @Amqp('counter')
  async getCounter(counter: { message: string, i: number }) {
    await this.prisma.post.create({
      data: {
        title: counter.message,
        index: counter.i
      }
    })
    console.log(counter)
  }
}
