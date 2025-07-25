"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cadastroSchema, type CadastroFormData, useRegisterWithAutoLogin, RegisterPayload } from '../../modules/auth'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { formatCPF, formatPhone, formatCEP } from '@/lib/format'
import { signIn } from "next-auth/react"
import Header from "@/components/Header"

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const router = useRouter()

  const brazilianStates = [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" },
  ]

  const cadastroForm = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      dataNascimento: "",
      endereco: "",
      cep: "",
      estado: "",
      cidade: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      acceptNewsletter: false,
    },
  })

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const registerMutation = useRegisterWithAutoLogin()

  const onCadastroSubmit = async (data: any) => {
    const payload: RegisterPayload = {
      name: data.nome,
      email: data.email,
      password: data.password,
      cpf: data.cpf,
      phone: data.telefone,
      birthDate: data.dataNascimento,
      address: data.endereco,
      city: data.cidade,
      state: data.estado,
      zipCode: data.cep,
      role: 'customer',
      acceptTerms: true,
      acceptNewsletter: false,
    }
    
    const loginData = {
      email: data.email,
      password: data.password
    }
    
    registerMutation.mutate({ payload, loginData })
  }

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.ok) {
        toast.success(`Login realizado com sucesso para ${data.email}!`)
        setIsLoginOpen(false)
        router.push("/")
        router.refresh() // Força a atualização da sessão
      } else {
        toast.error("Credenciais inválidas. Verifique seu e-mail e senha.")
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao fazer login. Verifique suas credenciais e tente novamente.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="TicketHub"
        showNav={false}
        childrenRight={
          <Button variant="ghost" size="sm" asChild className="flex items-center gap-2">
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
          </Button>
        }        
        onLoginClick={() => setIsLoginOpen(true)}
      />
      {/* Cadastro Form */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Criar sua conta</h2>
              <p className="text-muted-foreground mt-2">Preencha os dados abaixo para criar sua conta no TicketHub</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>Informe seus dados para criar sua conta</CardDescription>
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Já possui uma conta?{" "}
                    <button
                      type="button"
                      onClick={() => setIsLoginOpen(true)}
                      className="text-primary hover:underline font-medium cursor-pointer"
                    >
                      Clique aqui para fazer login
                    </button>
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...cadastroForm}>
                  <form onSubmit={cadastroForm.handleSubmit(onCadastroSubmit)} className="space-y-6">
                    {/* Dados Pessoais */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={cadastroForm.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo *</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={cadastroForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={cadastroForm.control}
                        name="telefone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(11) 99999-9999"
                                {...field}
                                onChange={(e) => {
                                  const formatted = formatPhone(e.target.value)
                                  if (formatted.length <= 15) {
                                    field.onChange(formatted)
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={cadastroForm.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="000.000.000-00"
                                {...field}
                                onChange={(e) => {
                                  const formatted = formatCPF(e.target.value)
                                  if (formatted.length <= 14) {
                                    field.onChange(formatted)
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Novos campos: Data de Nascimento e Gênero */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={cadastroForm.control}
                        name="dataNascimento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Nascimento *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Novos campos: Estado e Cidade */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={cadastroForm.control}
                        name="estado"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione seu estado" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {brazilianStates.map((state) => (
                                  <SelectItem key={state.value} value={state.value}>
                                    {state.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={cadastroForm.control}
                        name="cidade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade *</FormLabel>
                            <FormControl>
                              <Input placeholder="Sua cidade" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Adicionar campos de endereço e cep */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={cadastroForm.control}
                        name="endereco"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endereço *</FormLabel>
                            <FormControl>
                              <Input placeholder="Rua, número, complemento" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={cadastroForm.control}
                        name="cep"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="00000-000"
                                {...field}
                                onChange={e => {
                                  const formatted = formatCEP(e.target.value)
                                  if (formatted.length <= 9) {
                                    field.onChange(formatted)
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    {/* Senha */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Criar Senha</h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={cadastroForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mínimo 8 caracteres"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={cadastroForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirmar Senha *</FormLabel>
                              <FormControl>
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Repita a senha"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Termos e Condições */}
                    <div className="space-y-4">
                      <FormField
                        control={cadastroForm.control}
                        name="acceptTerms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm">
                                Eu aceito os{" "}
                                <a href="#" className="text-primary hover:underline">
                                  Termos de Uso
                                </a>{" "}
                                e a{" "}
                                <a href="#" className="text-primary hover:underline">
                                  Política de Privacidade
                                </a>{" "}
                                *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={cadastroForm.control}
                        name="acceptNewsletter"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm">Quero receber novidades e promoções por e-mail</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Botões */}
                    <div className="space-y-4">
                      <Button type="submit" className="w-full" size="lg" disabled={cadastroForm.formState.isSubmitting}>
                        {cadastroForm.formState.isSubmitting ? "Criando conta..." : "Criar Conta"}
                      </Button>

                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Já tem uma conta?{" "}
                          <button
                            type="button"
                            onClick={() => setIsLoginOpen(true)}
                            className="text-primary hover:underline font-medium cursor-pointer"
                          >
                            Faça login aqui
                          </button>
                        </p>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Login Dialog */}
        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Entrar na sua conta</DialogTitle>
              <DialogDescription>Digite suas credenciais para acessar sua conta</DialogDescription>
            </DialogHeader>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Sua senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Ainda não tem uma conta?{" "}
                    <button
                      type="button"
                      onClick={() => setIsLoginOpen(false)}
                      className="text-primary hover:underline font-medium"
                    >
                      Cadastre-se aqui
                    </button>
                  </p>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsLoginOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loginForm.formState.isSubmitting}>
                    {loginForm.formState.isSubmitting ? "Entrando..." : "Entrar"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
  )
}
