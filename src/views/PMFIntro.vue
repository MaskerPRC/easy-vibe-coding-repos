<template>
  <div class="pmf-container">
    <header class="header">
      <div class="header-content">
        <h1>一文读懂：PMF（Product Market Fit）与产品管理</h1>
        <p class="subtitle">当某个产品正好符合了市场的需求，并且能够被市场消费，那是 Product-Market Fit（PMF）</p>
      </div>
    </header>

    <nav class="nav">
      <div class="nav-content">
        <a href="#what-is-pmf" @click.prevent="scrollTo('what-is-pmf')">什么是PMF</a>
        <a href="#deep-dive" @click.prevent="scrollTo('deep-dive')">深入了解</a>
        <a href="#key-metrics" @click.prevent="scrollTo('key-metrics')">关键指标</a>
        <a href="#key-actions" @click.prevent="scrollTo('key-actions')">关键行为</a>
        <a href="#pmf-steps" @click.prevent="scrollTo('pmf-steps')">PMF步骤</a>
      </div>
    </nav>

    <main class="content">
      <!-- 什么是PMF -->
      <section id="what-is-pmf" class="section">
        <h2>一、什么是PMF</h2>
        <p class="intro">PMF是Product Market Fit的简写，是指产品和市场达到最佳的契合点，你所提供的产品正好满足市场的需求，令客户满意，这是创业成功的第一步。</p>

        <p>Product-Market Fit（产品市场契合度）是一种商业概念，指的是一家公司的产品能够成功满足市场的需求。这个概念通常用于初创公司和新产品的背景下，强调产品或服务与其目标客户群体的需求之间的契合程度。当一家公司实现了Product-Market Fit，意味着它找到了一个市场需求，并且提供了有效解决这个需求的产品或服务。</p>

        <div class="highlight-box">
          <h3>PMF的诞生</h3>
          <p>MPF最早是由Marc Andreessen在他的博客中提出的，Andreessen是Netscape的联合创始人，后来也是一名风险投资家。他最早对于MPF的定义是：</p>
          <blockquote>
            "Product/market fit means being in a good market with a product that can satisfy that market."
          </blockquote>
          <p>而他甚至认为 <strong>"The only thing that matters is getting to product/market fit."</strong> （PMF是创业早期唯一重要的事情。）</p>
        </div>

        <h3>MVP与PMF</h3>
        <p>许多做产品和解决方案的同学都知道了MVP（最小可行性产品），我们在做产品孵化的环节都会用到这个方法，但我们的第一轮产品做出来之后呢？如何进行更大范围的市场覆盖呢，面向哪一类客户群体进行覆盖呢？这就需要使用到PMF的方法。</p>

        <h3>PMF如何理解？</h3>
        <p>PMF是指你的目标消费者稳步购买、使用并向他人推荐你的产品，从而使你的产品的市场价值和增长稳步上升。《精益创业》的作者Eric Ries 提出，"PMF一词描述的是：一家初创公司最终找到与其产品产生共鸣的广泛客户群'的时刻"。</p>

        <div class="criteria-box">
          <h4>产品和市场要达到良好的匹配有3个标准：</h4>
          <ul>
            <li>是否解决了用户的问题</li>
            <li>是否解决了产品渠道问题</li>
            <li>是否用户真的愿意付费</li>
          </ul>
        </div>

        <div class="insight-box">
          <h4>CBInsight指出新创公司失败的20个原因，前三名分别是：</h4>
          <ol>
            <li><strong>产品没有市场 (42%)</strong></li>
            <li>资金用完 (29%)</li>
            <li>团队能力不足 (23%)</li>
          </ol>
          <p class="note">用通俗的话来说，PMF就是"找到了能够赚钱的产品"。</p>
        </div>
      </section>

      <!-- PMF深入了解 -->
      <section id="deep-dive" class="section">
        <h2>二、PMF深入了解</h2>
        <p>关于PMF的分析，是让创业者思考：</p>
        <ul>
          <li>你的产品是否是客户真正需求的产品</li>
          <li>你的产品是否真正找到它的市场</li>
          <li>你的产品是否未来有一个大的市场空间</li>
          <li>你的产品是否客户愿意买单，你能获得收益</li>
          <li>还是，你的产品刚刚一上市就宣告失败</li>
        </ul>

        <h3>PMF的组成</h3>
        <p>PMF分成三部分：Market，Product，Product-Market Fit</p>

        <div class="component-grid">
          <div class="component-card">
            <h4>Market（市场）</h4>
            <p>市场中包含了我们的目标客户（Target Customer），以及未被满足的需求（Underserved Needs）。</p>
            <p class="note">我们的每一件产品都是用来解决某一群人的某个问题的。所以不管是创业还是做一件产品，最重要的都是要很早的发现自己的目标客群，以及他们现在需要但缺少什么。</p>
          </div>

          <div class="component-card">
            <h4>Product（产品）</h4>
            <p>在模型里被定义为价值主张（Value Proposition），功能集合（Feature Set），用户体验（UX）。</p>
            <p class="note">每一个产品都是为了满足某种需求而诞生的。所以这个产品所能满足的需求就是一种它的价值主张。并且它必须通过某些功能给用户使用才能去体现出它的价值。</p>
          </div>

          <div class="component-card">
            <h4>Product-Market Fit</h4>
            <p>用户从来说不清自己想要什么。他们只知道自己有某种需求，但是具体是什么，可能连他们自己都无法描述出来。</p>
            <p class="note">这一个挖掘出用户需求并且找到合适产品的过程，就是Product-Market Fit。</p>
          </div>
        </div>

        <h3>PMF的动态性</h3>
        <p>市场和用户需求是变化的，即便用户的底层本质需求没变，但仍然要因为市场变动去优化你的产品。</p>
        <div class="example-box">
          <p><strong>例如：</strong>夏天很热，人们需要消暑，在古代，人们是靠冰块、扇子解暑，近代我们有了电风扇，而现代我们有了空调。人们的本质还是解暑，只是解决用户的生产方式变了。</p>
        </div>

        <h3>PMF的重要性</h3>
        <p>根据PMF的性质，你可以看出它对于市场上的每种产品都非常重要。它决定了产品的使用寿命以及其在市场上的盈利能力。</p>

        <div class="highlight-box">
          <h4>当你拥有PMF也就意味着：</h4>
          <ul>
            <li>你能够成功满足目标市场的需求</li>
            <li>你的定价对你的目标用户来说是可以接受的，并且你对未来的盈利能力没有任何问题</li>
            <li>你拥有健康的留存率、可控的流失率和高客户满意度（例如，高净推荐值）</li>
            <li>你的营销策略和渠道能够成功定位买家的角色，并可能为你带来足够的人来确保良好的市场份额</li>
          </ul>
        </div>
      </section>

      <!-- 关键指标 -->
      <section id="key-metrics" class="section">
        <h2>三、PMF关键指标</h2>

        <div class="metric-card">
          <h3>1. 公司是否已经实现了盈利</h3>
          <p>这里的盈利表现在两个方面：一是公司总收入与成本之间的差额，二是客户生命周期价值 (LTV) 与其获取成本 (CAC) 之间的差异。</p>

          <div class="definition-box">
            <div class="definition-item">
              <strong>LTV（客户生命的周期价值）：</strong>
              <p>公司从用户所有的互动中所得到的全部经济收益的总和</p>
            </div>
            <div class="definition-item">
              <strong>CAC（获取用户成本）：</strong>
              <p>公司获取用户的成本</p>
            </div>
          </div>

          <div class="formula-box">
            <p class="formula">客户终身价值 (LTV) > 客户获取成本 (CAC)</p>
            <p class="note">良好的商业模式行业标准比例为 <strong>3:1</strong></p>
          </div>
        </div>

        <div class="metric-card">
          <h3>2. 公司增长速度是否足够快</h3>
          <p>在初创公司早期，增长速度可以说是一家企业的生命指标。一家企业的快速增长率，意味着很多人想要使用你的产品并且付费。</p>

          <div class="formula-box">
            <h4>"40 法则"</h4>
            <p class="formula">营业收入成长率 + 利润率 ≥ 40%</p>
            <p class="note">例如：如果你的年增长率为 100%（这对于早期初创公司来说是极其优秀的），那么你可以承受 60% 的亏损。</p>
          </div>
        </div>

        <div class="metric-card">
          <h3>3. 有多少用户放弃你的产品会'极度失望'</h3>
          <p>Dropbox的创立者肖恩·埃利斯提出了一个测试，该测试也称为 PMF 的 NPS（净推荐值）：</p>

          <div class="survey-box">
            <p class="question">如果你不再使用这个产品你会感觉怎么样？</p>
            <div class="options">
              <span class="option">没有感觉</span>
              <span class="option">有点失望</span>
              <span class="option highlight">非常失望</span>
            </div>
          </div>

          <div class="benchmark-box">
            <p><strong>基准：</strong>如果调查结果超过 <span class="highlight">40%</span> 的用户不再使用你的产品会'非常失望'，那么恭喜你，达到了PMF的一个强有力指标。</p>
          </div>
        </div>

        <div class="metric-card">
          <h3>4. 健康的用户留存率</h3>
          <p>在PMF过程中，健康的留存率也是一个衡量PMF的指标。一个良好的留存率表明你的用户正在定期、长期的使用你的产品并获得价值。</p>
          <p class="note">保持一个稳定的用户留存率意味着你有稳定的用户和持续付费的收益，这些也意味着你的产品是被市场所认可且有价值的。</p>
        </div>

        <div class="metric-card">
          <h3>5. 使用一些其他指标</h3>
          <p>尽管 PMF 调查是产品市场契合度的领先指标，但在测试 PMF 时不要忘记其他指标也很重要。</p>

          <div class="metrics-grid">
            <div class="metric-item">
              <strong>CSTA：</strong>用户满意度
              <p>衡量客户对您的公司、服务或产品的满意度</p>
            </div>
            <div class="metric-item">
              <strong>CES：</strong>用户努力得分
              <p>衡量客户为完成贵公司的任务所付出的努力</p>
            </div>
            <div class="metric-item">
              <strong>NPS：</strong>净推荐值
              <p>评估客户的忠诚度、推荐度和满意度</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 关键行为 -->
      <section id="key-actions" class="section">
        <h2>四、PMF关键行为</h2>

        <div class="action-card">
          <h3>1. 从潜在市场逆向工作</h3>
          <p>没有任何一个产品拥有无界限的潜在市场。所以，不仅要找到可以尝试你的产品的人，还要找到那些可能成为忠实用户的人，这是每个软件即服务（SaaS）策略的一个基本要素。</p>

          <div class="concept-box">
            <h4>潜在市场（TAM）</h4>
            <p>潜在市场是你可以用来预估目标市场规模（及其潜在收入）的度量标准。一旦你确认了潜在市场，就可以确定潜在市场中客户的所占的百分比。</p>
          </div>

          <h4>如何预估潜在市场</h4>
          <div class="example-box">
            <p><strong>策略：</strong>从询问早期客户若你的产品消失，他们会作何感想开始。</p>
            <p>Sean Ellis说这可以归结为一个简单的调查问题："如果你从此以后不能再使用某一产品，你感觉如何？"</p>

            <div class="case-study">
              <h5>实践案例：</h5>
              <p>假设你有一个提供酒店推荐服务的APP，其中有1000个人下载了该APP。</p>
              <ul>
                <li>在这1000人中，有300人表示如果该APP停止使用，他们会十分失望</li>
                <li>这300个人就是该APP目标市场的缩影</li>
                <li>分析这300个人的共同特征（如千禧一代、每月出差两次等）</li>
                <li>根据这些特征计算出潜在市场规模</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="action-card">
          <h3>2. 有针对性地专注于服务你的目标市场</h3>
          <p>当你发现你的APP并不能成为每个网民的必需品时，尽管你会十分失望，但如果你想同时去满足所有人，这必然会导致失败。</p>

          <div class="insight-box">
            <p class="highlight">与其让自己的产品成为上亿人可有可无的选择，不如让其成为数百万人的重要资源。</p>
          </div>

          <p>Superhuman的创始人和首席执行官Rahul Vohra相信：通往成功的道路是关注核心的专门用户，了解他们喜欢什么，结合解决使那些同样落在之前识别的潜在群体中，保持观望态度的用户犹豫的问题，从而使产品变得更好。</p>
        </div>

        <div class="action-card">
          <h3>3. 有效的产品分析</h3>
          <p>你有很多注册用户和一些潜在客户告诉你他们会购买你的产品。但他们现在真的使用你的产品吗？</p>

          <div class="framework-box">
            <h4>AARRR 模型</h4>
            <p>可以用AARRR模型来评估你的产品，把你的产品视为一个漏水的桶。AARRR 框架揭示了值得填补的漏洞，即人们在成为您的忠实客户的过程中逐渐流失的漏洞，找出是什么阻碍你实现PMF。</p>
            <div class="aarrr-list">
              <div class="aarrr-item">A - Acquisition（获取）</div>
              <div class="aarrr-item">A - Activation（激活）</div>
              <div class="aarrr-item">R - Retention（留存）</div>
              <div class="aarrr-item">R - Revenue（收益）</div>
              <div class="aarrr-item">R - Referral（推荐）</div>
            </div>
          </div>
        </div>

        <div class="action-card">
          <h3>4. 对深度使用产品的用户进行PMF调查</h3>
          <p>不能对所有用户进行PMF调查，最好选择深度使用我们产品的用户。增长黑客之父 Sean Ellis 概述了客户在进行 PMF 调查之前必须满足的标准：</p>

          <ul class="criteria-list">
            <li>了解产品核心的客户</li>
            <li>使用过该产品至少两次的客户</li>
            <li>过去两周与你的产品互动过的客户</li>
          </ul>
        </div>

        <div class="action-card">
          <h3>5. 定期持续的用户访谈</h3>
          <p>客户的需求可能会随着时间的推移而变化，因此必须不断测试PMF，以相应地调整你的业务策略。在公司发展的每个阶段，你都需要收集目标用户的反馈，以防止客户保留率和收入下降。</p>
        </div>
      </section>

      <!-- PMF步骤 -->
      <section id="pmf-steps" class="section">
        <h2>五、PMF的步骤</h2>
        <p>实现Product-Market Fit通常被认为是初创公司成功的关键步骤。这个过程包括：</p>

        <div class="process-box">
          <div class="process-item">
            <h4>理解市场需求</h4>
            <p>这意味着深入了解目标客户的需求、痛点以及他们如何做出购买决策。</p>
          </div>
          <div class="process-item">
            <h4>产品开发</h4>
            <p>根据市场需求来设计和开发产品。这可能需要多次迭代，以确保产品能够满足市场的具体需求。</p>
          </div>
          <div class="process-item">
            <h4>市场验证</h4>
            <p>通过市场测试、客户反馈和销售数据来验证产品是否真正满足市场需求。</p>
          </div>
          <div class="process-item">
            <h4>不断调整</h4>
            <p>根据市场反馈对产品进行调整，以更好地满足客户需求和期望。PMF产品管理至关重要，正确的PMF产品管理，能够加速产品达到了Product-Market Fit。</p>
          </div>
        </div>

        <h3>PMF六个步骤</h3>

        <div class="step-card">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>告别传统项目经验</h4>
            <p>传统的产品管理理念并不适合早期阶段的初创公司。这些方法论都是为了已经初具规模和大型公司准备的，确保他们以客户服务为中心来扩张。</p>

            <div class="do-dont-grid">
              <div class="dont-box">
                <h5>不要做的事情：</h5>
                <ul>
                  <li>设计一个产品路线图（特别是超过3个月）</li>
                  <li>编写用户故事和史诗</li>
                  <li>做太多用户调研</li>
                  <li>意见领袖（如果你有一个建议，大声说出来并采取行动）</li>
                  <li>设定计划就忘了</li>
                  <li>听所有人的</li>
                  <li>不要陷入战略规划文档中</li>
                </ul>
              </div>
              <div class="do-box">
                <h5>需要做的事情：</h5>
                <ul>
                  <li>编写问题清单</li>
                  <li>绘制高保真原型</li>
                  <li>快速发布</li>
                  <li>选最重要的</li>
                  <li>权力下放</li>
                  <li>发布后收集反馈</li>
                  <li>建立一个社区</li>
                  <li>每天与用户沟通</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>从正确的MVP开始</h4>
            <p>MVP的理想状态是，你做出一个很小的解决方案，把它给一些种子用户体验，看是产品是否真正的解决了他们的问题。</p>

            <div class="question-box">
              <p>但大部分情况下，第一个版本往往不符合人们的预期和需求，所以你开始思考：</p>
              <ul>
                <li>你解决了一个真正的问题吗？</li>
                <li>你的解决方案正确吗？</li>
                <li>你的目标人群正确吗？</li>
              </ul>
            </div>

            <div class="advice-box">
              <h5>如何从一开始就推出正确的MVP？</h5>
              <ul>
                <li>要有条理的发布第一个版本</li>
                <li>相信你的直觉</li>
                <li>解决一个你自身经历的痛点</li>
                <li>在发布中持续学习和改进，有必要时，做好全盘改变的准备</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>高效和精准地确定优先事项</h4>
            <p>对任何试图构建新产品的小企业来说，正确的决策是非常重要的。选择最重要的工作事项有六个关键因素：</p>

            <ol class="priority-list">
              <li><strong>只设定一个最高优先级：</strong>你的资源是有限的。设定一个目标，随时调整你的计划以增加你成功的机会。</li>
              <li><strong>将你的计划比喻成一个罐子：</strong>首先把大的石头（重要的投资决策）放进去，然后再加入细沙（容易实现的小目标）。</li>
              <li><strong>资源集中在一个决策：</strong>选择一个最有远见的投资决策。</li>
              <li><strong>缩短任务完成期限：</strong>不要按季度规划，而是每6周规划一次。迭代尽量1周一次，而不是2周。</li>
              <li><strong>及时评估：</strong>及时定义和评估工作量。</li>
              <li><strong>解决10%-30%的技术债务：</strong>为漏洞和技术债务分配一定比例的资源。</li>
            </ol>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number">4</div>
          <div class="step-content">
            <h4>快速迭代</h4>
            <p>在初创团队做事缓慢，并不能使团队变得更好。它只会让每件事花费更多的时间。提高速度并不意味快速发布一些产品或者推出一些无关紧要的功能。它意味着更高效和更机智的创建和发布产品。</p>

            <div class="tips-box">
              <h5>提高速度的特别方法：</h5>
              <ul>
                <li><strong>避免使用暂存环境：</strong>在开发和生产阶段之间不应有任何步骤或环境</li>
                <li><strong>采用功能标签：</strong>给功能做出标签区分，在测试的时候可以邀请用户加入其中</li>
                <li><strong>缩小范围：</strong>发散式思考，收敛性实施</li>
                <li><strong>编写有规律的发布日志：</strong>每周更新像是迭代加速器</li>
                <li><strong>立刻测试：</strong>开发完毕必须马上投入测试</li>
                <li><strong>让工程师拥有主人翁精神：</strong>使工程师明确的知道他们的责任是解决用户的问题</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number">5</div>
          <div class="step-content">
            <h4>设定正确的里程碑</h4>
            <p>PMF并不是一个二元的选择，而是一个持续规模的过程。首先，产品什么都没有，接着变成初具规模的PMF，持续发展，成长为强大的PMF。</p>

            <div class="milestone-grid">
              <div class="milestone-box">
                <h5>定性里程碑</h5>
                <div class="milestone-stage">
                  <strong>从0到1阶段：</strong>
                  <p>10%的用户满意率</p>
                </div>
                <div class="milestone-stage">
                  <strong>初步进入PMF：</strong>
                  <ul>
                    <li>超过20%的用户满意率</li>
                    <li>用户会愿意为你早期产品付钱</li>
                    <li>企业用户向你提供一个份产品采购清单</li>
                    <li>你的服务宕机时，顾客会非常快的察觉</li>
                  </ul>
                </div>
                <div class="milestone-stage">
                  <strong>成熟PMF阶段：</strong>
                  <p>40%的用户对于不再使用你的产品而感到非常失望</p>
                </div>
              </div>

              <div class="milestone-box">
                <h5>定量里程碑</h5>
                <div class="milestone-stage">
                  <strong>从0到1阶段：</strong>
                  <ul>
                    <li>转化率 < 1%</li>
                    <li>少于50个活跃用户</li>
                    <li>6个月，用户的留存率 < 20%</li>
                  </ul>
                </div>
                <div class="milestone-stage">
                  <strong>初步进入PMF：</strong>
                  <ul>
                    <li>转化率 > 2%</li>
                    <li>B2B业务：50个活跃租户；B2C：500 WAU/DAU</li>
                    <li>活跃用户每周不断增长3%</li>
                    <li>6个月，用户的留存率在20%-40%</li>
                  </ul>
                </div>
                <div class="milestone-stage">
                  <strong>成熟PMF阶段：</strong>
                  <ul>
                    <li>活跃用户增长5%-10%</li>
                    <li>6个月，留存率 > 40%</li>
                    <li>10K+ MRR（月度经常性收入）</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number">6</div>
          <div class="step-content">
            <h4>不断的学习和收集信息</h4>
            <p>在产品市场匹配之前，产品管理所能产生的最重要的价值不是用户注册、客户反馈或收入，而是知识和经验的学习过程。</p>

            <div class="learning-box">
              <h5>学习的重点包括：</h5>
              <ul>
                <li>一个让他人非常有共鸣的价值观</li>
                <li>一个根本不关心你产品的角色</li>
                <li>一个客户来源非常集中的渠道</li>
                <li>一个即将被停用的过时技术</li>
                <li>你可能在公测时推行的新技术</li>
              </ul>
              <p class="highlight">随着时间的推移，谁能获取更多的经验和学习机会，谁就会成功。</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 总结 -->
      <section class="section summary">
        <h2>总结</h2>
        <p>以上简述了PMF的定义、重要性、指标与实践方法。这里需要注意一件事：<strong>没有一种真正的方法可以让你找到适合市场的产品！</strong></p>

        <p>这篇文章的衡量指标只是对产品的建议和参考，是为了帮助你的产品提供目前或者未来的一些见解和技巧，每个产品都是独一无二的，需要解决的方法也是各不相同。真正的产品方法论重要，但是仍需要实践出真知，产品的方法论只能帮助我们更少的避开坑，所以还需要结合自己的实际产品来思考。</p>

        <div class="final-advice">
          <p>产品管理在实现产品市场匹配之前可能存在问题，但没关系，你可以改善这种情况。放弃传统的做法，把注意力集中在解决真实的问题上，从一个明确定义的最小可行产品（MVP）开始。然后，要高效地确定优先事项，迅速行动，设定可实现可量化的目标，及时对市场进行洞察并迅速应对。</p>

          <p class="highlight">总的来说，这些方法将使你比其他人更快地前进，而且更重要的是，朝着正确的方向前进。它们将帮助你利用产品管理来增加实现产品市场匹配的机会。</p>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>© 2025 PMF 产品市场契合度介绍</p>
    </footer>
  </div>
</template>

<script setup>
const scrollTo = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
</script>

<style scoped>
.pmf-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #333;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.2em;
  opacity: 0.95;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.nav {
  background: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 15px 20px;
  gap: 10px;
}

.nav-content a {
  color: #667eea;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 20px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-content a:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background: white;
  min-height: calc(100vh - 200px);
}

.section {
  margin-bottom: 60px;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section h2 {
  color: #667eea;
  font-size: 2em;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 3px solid #667eea;
}

.section h3 {
  color: #764ba2;
  font-size: 1.5em;
  margin: 30px 0 20px 0;
}

.section h4 {
  color: #555;
  font-size: 1.2em;
  margin: 20px 0 15px 0;
}

.section p {
  line-height: 1.8;
  margin-bottom: 15px;
  color: #555;
}

.intro {
  font-size: 1.1em;
  font-weight: 500;
  color: #333;
  background: #f8f9ff;
  padding: 20px;
  border-left: 4px solid #667eea;
  border-radius: 4px;
  margin-bottom: 25px;
}

.highlight-box {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  padding: 25px;
  border-radius: 10px;
  margin: 25px 0;
  border-left: 4px solid #667eea;
}

.highlight-box h3 {
  margin-top: 0;
}

blockquote {
  border-left: 4px solid #764ba2;
  padding-left: 20px;
  margin: 20px 0;
  font-style: italic;
  color: #555;
  background: #fff;
  padding: 15px 20px;
  border-radius: 4px;
}

.criteria-box,
.insight-box {
  background: #fff;
  border: 2px solid #667eea;
  padding: 20px;
  border-radius: 10px;
  margin: 25px 0;
}

.criteria-box h4,
.insight-box h4 {
  color: #667eea;
  margin-top: 0;
}

.criteria-box ul,
.insight-box ol {
  margin: 15px 0;
  padding-left: 25px;
}

.criteria-box li,
.insight-box li {
  margin: 10px 0;
  line-height: 1.6;
}

.note {
  color: #764ba2;
  font-weight: 500;
  font-style: italic;
  margin-top: 15px;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin: 30px 0;
}

.component-card {
  background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.1);
  border: 1px solid #667eea20;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.component-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(102, 126, 234, 0.2);
}

.component-card h4 {
  color: #667eea;
  margin-top: 0;
}

.example-box {
  background: #fffbf0;
  border-left: 4px solid #ffa726;
  padding: 20px;
  border-radius: 4px;
  margin: 20px 0;
}

.metric-card,
.action-card {
  background: #f8f9ff;
  padding: 30px;
  border-radius: 10px;
  margin: 30px 0;
  border: 1px solid #667eea30;
}

.metric-card h3,
.action-card h3 {
  margin-top: 0;
  color: #667eea;
}

.definition-box {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.definition-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #764ba2;
}

.definition-item strong {
  color: #764ba2;
  display: block;
  margin-bottom: 10px;
}

.formula-box {
  background: white;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  margin: 20px 0;
  border: 2px dashed #667eea;
}

.formula {
  font-size: 1.3em;
  font-weight: 700;
  color: #667eea;
  margin: 15px 0;
}

.survey-box {
  background: white;
  padding: 25px;
  border-radius: 10px;
  margin: 20px 0;
}

.question {
  font-size: 1.2em;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.options {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.option {
  padding: 12px 24px;
  background: #f0f0f0;
  border-radius: 25px;
  font-weight: 500;
}

.option.highlight {
  background: #667eea;
  color: white;
}

.benchmark-box {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.benchmark-box .highlight {
  font-size: 1.3em;
  font-weight: 700;
  color: #667eea;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 25px 0;
}

.metric-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border-top: 4px solid #764ba2;
}

.metric-item strong {
  color: #764ba2;
  font-size: 1.1em;
  display: block;
  margin-bottom: 10px;
}

.concept-box,
.framework-box {
  background: white;
  padding: 25px;
  border-radius: 10px;
  margin: 25px 0;
  border: 2px solid #667eea;
}

.concept-box h4,
.framework-box h4 {
  color: #667eea;
  margin-top: 0;
}

.case-study {
  background: #f8f9ff;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.case-study h5 {
  color: #764ba2;
  margin-top: 0;
}

.aarrr-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
}

.aarrr-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
}

.criteria-list {
  list-style: none;
  padding: 0;
}

.criteria-list li {
  background: white;
  padding: 15px 20px;
  margin: 10px 0;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.criteria-list li:before {
  content: "✓ ";
  color: #667eea;
  font-weight: 700;
  font-size: 1.2em;
  margin-right: 10px;
}

.process-box {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin: 30px 0;
}

.process-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.process-item:hover {
  transform: translateY(-5px);
}

.process-item h4 {
  color: white;
  margin-top: 0;
}

.step-card {
  display: flex;
  gap: 25px;
  background: #f8f9ff;
  padding: 30px;
  border-radius: 15px;
  margin: 30px 0;
  border: 2px solid #667eea30;
  align-items: flex-start;
}

.step-number {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8em;
  font-weight: 700;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
}

.step-content {
  flex: 1;
}

.step-content h4 {
  margin-top: 0;
  color: #667eea;
  font-size: 1.5em;
}

.do-dont-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin: 25px 0;
}

.dont-box,
.do-box {
  padding: 20px;
  border-radius: 10px;
}

.dont-box {
  background: #fff5f5;
  border: 2px solid #ff6b6b;
}

.do-box {
  background: #f0fff4;
  border: 2px solid #51cf66;
}

.dont-box h5 {
  color: #ff6b6b;
  margin-top: 0;
}

.do-box h5 {
  color: #51cf66;
  margin-top: 0;
}

.question-box {
  background: #fffbf0;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #ffa726;
  margin: 20px 0;
}

.advice-box,
.tips-box,
.learning-box {
  background: white;
  padding: 25px;
  border-radius: 10px;
  margin: 25px 0;
  border: 2px solid #667eea;
}

.advice-box h5,
.tips-box h5,
.learning-box h5 {
  color: #667eea;
  margin-top: 0;
}

.priority-list {
  list-style: none;
  counter-reset: priority-counter;
  padding: 0;
}

.priority-list li {
  counter-increment: priority-counter;
  background: white;
  padding: 20px;
  margin: 15px 0;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  position: relative;
  padding-left: 60px;
}

.priority-list li:before {
  content: counter(priority-counter);
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.milestone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin: 30px 0;
}

.milestone-box {
  background: white;
  padding: 25px;
  border-radius: 10px;
  border: 2px solid #667eea;
}

.milestone-box h5 {
  color: #667eea;
  margin-top: 0;
  font-size: 1.3em;
  text-align: center;
  padding-bottom: 15px;
  border-bottom: 2px solid #667eea30;
}

.milestone-stage {
  margin: 20px 0;
  padding: 15px;
  background: #f8f9ff;
  border-radius: 8px;
}

.milestone-stage strong {
  color: #764ba2;
  display: block;
  margin-bottom: 10px;
}

.summary {
  background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
  padding: 40px;
  border-radius: 15px;
  border: 2px solid #667eea30;
}

.final-advice {
  background: white;
  padding: 30px;
  border-radius: 10px;
  margin-top: 30px;
  border-left: 4px solid #667eea;
}

.final-advice .highlight {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  font-weight: 600;
  color: #333;
}

.footer {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 30px;
  margin-top: 60px;
}

ul, ol {
  padding-left: 25px;
}

li {
  margin: 10px 0;
  line-height: 1.6;
}

strong {
  color: #667eea;
}

@media (max-width: 768px) {
  .header-content h1 {
    font-size: 1.8em;
  }

  .subtitle {
    font-size: 1em;
  }

  .nav-content {
    justify-content: flex-start;
    overflow-x: auto;
  }

  .component-grid,
  .do-dont-grid,
  .milestone-grid {
    grid-template-columns: 1fr;
  }

  .step-card {
    flex-direction: column;
  }

  .step-number {
    width: 50px;
    height: 50px;
    font-size: 1.5em;
  }
}
</style>
