import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from './common/pipe/validation.pipe';

import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 注册全局响应拦截器
  // 注意: 对于 SSE 流式返回等特殊接口，如果需要跳过此统一格式化拦截器，
  // 请在对应的 Controller 或其路由方法上使用 @IgnoreTransform() 装饰器。
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  // 注册全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 注册全局数据验证管道
  app.useGlobalPipes(new ValidationPipe());

  // 配置 Swagger API 文档
  const config = new DocumentBuilder()
    .setTitle('Agentic Engine Gateway API')
    .setDescription('Gateway 接口文档')
    .setVersion('1.0')
    // .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
